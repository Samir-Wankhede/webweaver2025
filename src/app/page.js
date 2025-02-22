"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader } from "lucide-react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const scamFacts = [
    "📢 Over 1.5 million people fall victim to call scams every year.",
    "⚠️ Phone scams cost consumers over $40 billion annually.",
    "🚨 90% of scam calls use social engineering tactics to manipulate victims.",
    "❌ 1 in 3 people have received a scam call pretending to be from a bank.",
    "🔍 Scammers often use VoIP numbers to mask their real identity.",
  ];

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setAudioURL(URL.createObjectURL(selectedFile)); // Create a preview URL
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    setUploading(true);

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await fetch("/api/transcript", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("transcript", data.transcript);
        localStorage.setItem("score", data.score);
        router.push("/analysis");
      } else {
        alert("Upload failed!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative">
      
      {/* ScamShield Title */}
      <h1 className="text-4xl font-extrabold text-orange-300 mb-10 tracking-wide">
        ScamShield
      </h1>

      {/* Upload Box */}
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl w-96 text-center transform transition-all hover:scale-105 hover:shadow-orange-300">
        <h2 className="text-2xl font-bold text-orange-300">Upload Audio</h2>

        <label className="mt-4 flex items-center justify-center border-2 border-dashed border-orange-300 p-6 rounded-lg cursor-pointer hover:bg-orange-300 hover:text-black transition-all">
          <Upload className="w-6 h-6 mr-2" />
          <span className="font-semibold">{file ? file.name : "Choose File"}</span>
          <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
        </label>

        {audioURL && (
          <div className="mt-6">
            <p className="text-sm text-gray-400">Audio Preview:</p>
            <audio controls src={audioURL} className="w-full mt-2 bg-black rounded-lg shadow-lg" />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`mt-6 w-full py-2 rounded-lg text-lg font-bold transition-all 
            ${uploading ? "bg-gray-600" : "bg-orange-300 hover:bg-orange-300 text-black shadow-lg hover:shadow-orange-300"}`}
        >
          {uploading ? <Loader className="animate-spin mx-auto" /> : "Upload & Process"}
        </button>
      </div>

      {/* Scam Statistics Scrolling News Ticker */}
      <div className="absolute bottom-5 w-full overflow-hidden bg-orange-300 text-black py-2 font-semibold text-sm">
        <div className="flex space-x-10 animate-marquee">
          {scamFacts.map((fact, index) => (
            <span key={index} className="whitespace-nowrap">
              {fact}
            </span>
          ))}
        </div>
      </div>

      {/* Marquee Animation */}
      <style jsx>{`
        .animate-marquee {
          display: flex;
          animation: marquee 15s linear infinite;
        }
        @keyframes marquee {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
