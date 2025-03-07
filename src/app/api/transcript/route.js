import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { SpeechClient } from "@google-cloud/speech";
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
import path from "path";
import fs from "fs";

// Decode and write service account JSON to a file
const credentialsPath = path.join(process.cwd(), "api-key.json");

if (!fs.existsSync(credentialsPath)) {
  fs.writeFileSync(credentialsPath, Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON, "base64").toString("utf8"));
}

function isFlacFile(filePath) {
    return path.extname(filePath).toLowerCase() === '.flac';
}

process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

const storage = new Storage();
const speechClient = new SpeechClient();
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const BUCKET_NAME = process.env.GCS_BUCKET_NAME;
const PROCESSED_BUCKET = process.env.GCS_PROCESSED_BUCKET_NAME;
const APP_ENGINE_URL = process.env.AUDIOFORMATTER;

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");
    if (!audioFile) {
      return NextResponse.json({ error: "No audio file uploaded" }, { status: 400 });
    }
    console.log(audioFile.name);
    const fileName = `${Date.now()}-${audioFile.name}`;
     // Poll for the FLAC file
     const processedFileName = fileName.replace(/\.\w+$/, ".flac");
     const processedFile = storage.bucket(PROCESSED_BUCKET).file(processedFileName);
    if(!isFlacFile(audioFile.name)){
        // Upload audio to GCS
        const bucket = storage.bucket(BUCKET_NAME);
        const file = bucket.file(fileName);

        await file.save(Buffer.from(await audioFile.arrayBuffer()), {
        metadata: { contentType: audioFile.type },
        });

        console.log(`Uploaded: ${fileName}`);

        // Call App Engine service (triggers conversion)
        await fetch(APP_ENGINE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
        });
        let retries = 20;
        while (retries-- > 0) {
            const [exists] = await processedFile.exists();
            if (exists) break;
                console.log("Waiting for FLAC conversion...");
                await new Promise((r) => setTimeout(r, 3000));
            }

            if (retries <= 0) {
                return NextResponse.json({ error: "FLAC conversion timeout" }, { status: 500 });
            }
    } else {
        await processedFile.save(Buffer.from(await audioFile.arrayBuffer()), {
            metadata: { contentType: audioFile.type },
        });
    }
    
    console.log(`FLAC ready: ${processedFileName}`);

    // Send FLAC to Google Speech-to-Text
    const request = {
      config: {
        encoding: "FLAC",
        languageCode: "en-US",
        enableAutomaticPunctuation: true,
        diarizationConfig: {
          enableSpeakerDiarization: true,
          minSpeakerCount: 2,
          maxSpeakerCount: 5,
        },
      },
      audio: { uri: `gs://${PROCESSED_BUCKET}/${processedFileName}` },
    };

    const [response] = await speechClient.recognize(request);
    const transcript = response.results.map((r) => r.alternatives[0].transcript).join("\n");
    await processedFile.delete();
    console.log(transcript);
    const resp = await fetch(process.env.PROCESSORAPI,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({
            text: transcript,
        })
    })
    const verdict = await resp.json();
    const score = verdict[1];
    
    //gen ai
    const promptText = "In the transcript of call that I'll be giving, based on context find words that are suspicious pointing to a scam (words like anydesk and more) give me only a javascript object in the format {'phrase': 'reason'} so that I can stringyfy it and send, return only {} when nothing found, dont give any extra text except this ever. Here's the transcript: ";
    const prompt = promptText + transcript;
    try{
        const result = await model.generateContent(prompt);
        const mappedWords = result.response.text().trim();
        return NextResponse.json({ transcript: transcript, score: score, verdict: verdict[0], map: JSON.stringify(mappedWords) }, { status: 200 });
    }catch(err){
        console.log(err);
        return NextResponse.json({ error: "Failed to map audio words" }, { status: 500 });
    }

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to process audio" }, { status: 500 });
  }
}
