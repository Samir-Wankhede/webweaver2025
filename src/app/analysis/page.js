// "use client";

// import { useEffect, useState } from "react";
// import { getTranscript } from "@/utils/api";

// export default function ProcessingPage() {
//   const [transcript, setTranscript] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchTranscript() {
//       const response = await getTranscript();
//       setTranscript(response || "Failed to load transcript.");
//       setLoading(false);
//     }
//     fetchTranscript();
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       {loading ? (
//         <h2 className="text-xl text-black font-semibold">Processing...</h2>
//       ) : (
//         <div className="w-3/4 p-4 bg-white rounded-md shadow-md">
//           <h2 className="text-lg font-bold mb-2">Transcript:</h2>
//           <p className="text-gray-700">{transcript}</p>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { getTranscript, getSuspicionScore } from "@/utils/api";

const suspiciousWords = {
  "scam": "Potential fraud-related term.",
  "lottery": "Common in phishing scams.",
  "urgent": "Often used in scam tactics.",
  "credit card": "Sensitive financial term.",
  "reward": "Common scam bait.",
  "bank account": "Financial fraud warning.",
  "password": "Phishing attempts often ask for this.",
  "OTP": "Scammers may request your OTP.",
  "verification": "Used in phishing attacks.",
  "gift": "Often used in fake giveaways.",
  "free": "Common scam keyword in fraud messages.",
  "insurance": "Insurance fraud is common.",
  "claim": "Scammers may say you have unclaimed money.",
  "limited time": "Creates false urgency.",
  "update details": "Phishing messages often ask for this.",
  "suspicious activity": "May indicate fraud alert scams.",
  "blocked": "Used to create panic in fraud schemes.",
  "pay now": "Common in payment scams.",
  "discount": "Sometimes used in fake e-commerce scams.",
  "loan approval": "Fake loan scams use this.",
  "authorized": "Scammers impersonate banks using this.",
  "transaction": "Fraudulent transaction alerts often contain this.",
  "security alert": "Fake bank alerts use this phrase.",
  "click here": "Phishing links often start with this.",
  "wire transfer": "Common in money fraud.",
  "money laundering": "Often linked to scams.",
  "investment": "Fake investment schemes use this.",
  "double your money": "Ponzi schemes use such claims.",
  "IRS": "Used in fake tax-related scams.",
  "customs": "Used in international parcel scams.",
  "bitcoin": "Crypto scams often mention this.",
  "winner": "Lottery scams call you a winner.",
  "inheritance": "Fake wealth scams use this.",
  "legal notice": "Threatening messages use this phrase.",
  "arrest": "Fake legal threats from scammers.",
  "court": "Used in fake legal threats.",
  "blackmail": "Extortion scams may mention this.",
  "foreign": "Used in advance-fee fraud.",
  "job offer": "Fake jobs often promise high pay.",
  "work from home": "Scam job listings use this.",
  "refund": "Refund scams trick people into sharing bank details.",
  "official": "Fake government scams use this.",
  "govt": "Scammers pretend to be government officials.",
  "restricted": "Creates fake urgency.",
  "unusual login": "Common in email phishing scams.",
  "confirm": "Often used in phishing emails.",
  "reset": "Password reset scams use this."
};

export default function ProcessingPage() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(true);
  const [suspicionScore, setSuspicionScore] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const transcriptResponse = await localStorage.getItem("transcript");
      const scoreResponse = await parseInt(localStorage.getItem("score"));
      
      setTranscript(transcriptResponse || "Failed to load transcript.");
      setSuspicionScore(scoreResponse || 50);
      setLoading(false);
    }
    fetchData();
  }, []);

  function highlightWords(text) {
    return text.split(" ").map((word, index) => {
      const cleanedWord = word.replace(/[.,!?]/g, "");
      const isSuspicious = suspiciousWords[cleanedWord.toLowerCase()];
  
      return (
        <span key={index} className="inline-block mr-1 relative group">
          {isSuspicious ? (
            <span className="text-red-500 cursor-pointer">
              {word}
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex w-64 bg-black/70 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
                {isSuspicious}
              </span>
            </span>
          ) : (
            word
          )}
          {" "} {/* Ensures space after each word */}
        </span>
      );
    });
  }

  function reportScam() {
    window.open("https://cybercrime.gov.in/", "_blank");
  }

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
            <p className="text-lg">{highlightWords(transcript)}</p>
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
