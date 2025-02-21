"use client";

import { useEffect, useState } from "react";
import { getTranscript } from "@/utils/api";

export default function ProcessingPage() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTranscript() {
      const response = await getTranscript();
      setTranscript(response || "Failed to load transcript.");
      setLoading(false);
    }
    fetchTranscript();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {loading ? (
        <h2 className="text-xl text-black font-semibold">Processing...</h2>
      ) : (
        <div className="w-3/4 p-4 bg-white rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Transcript:</h2>
          <p className="text-gray-700">{transcript}</p>
        </div>
      )}
    </div>
  );
}
