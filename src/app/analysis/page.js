"use client";

import { useEffect, useState } from "react";

export default function AnalysisPage() {
  const [transcript, setTranscript] = useState("");
  const [suspicionScore, setSuspicionScore] = useState(null);
  const [verdict, setVerdict] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTranscript(localStorage.getItem("transcript") || "No transcript available.");
    setSuspicionScore(parseInt(localStorage.getItem("score")) || 0);
    setVerdict(localStorage.getItem("verdict") || "Unknown");
    setLoading(false);
  }, []);

  let verdictColor = "bg-green-600";
  let verdictText = "✅ Low Risk";
  let showReportButton = false;

  if (suspicionScore > 70) {
    verdictColor = "bg-red-600";
    verdictText = "🔥 High Risk";
    showReportButton = true;
  } else if (suspicionScore > 40) {
    verdictColor = "bg-orange-500";
    verdictText = "⚠️ Moderate Risk";
  }

  function reportScam() {
    window.open("https://cybercrime.gov.in/", "_blank");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white space-y-6">
      {/* Verdict Box */}
      <div className={`w-3/4 p-4 rounded-lg shadow-xl text-center text-lg font-bold ${verdictColor}`}>
        ScamShield Verdict: {verdictText} ({suspicionScore}%)
      </div>

      {/* Processing Indicator */}
      {loading ? (
        <h2 className="text-xl font-semibold text-orange-300 animate-pulse">Processing...</h2>
      ) : (
        <div className="w-3/4 p-6 bg-zinc-900 rounded-lg shadow-xl border border-orange-300">
          <h2 className="text-2xl font-bold text-orange-300 mb-4">Transcript</h2>
          <div className="max-h-[300px] overflow-y-auto p-2 border border-gray-700 rounded-lg text-gray-300">
            <p className="text-lg">{transcript}</p>
          </div>
        </div>
      )}

      {/* Report Button (Only for High-Risk Calls) */}
      {showReportButton && (
        <button 
          onClick={reportScam} 
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition duration-300"
        >
          🚨 Report Scam Call
        </button>
      )}
    </div>
  );
}
