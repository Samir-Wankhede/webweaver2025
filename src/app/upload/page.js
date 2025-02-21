"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

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
      // Send to backend (replace with your actual backend API)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/processing"); // Redirect to processing page
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-xl font-bold mb-4">Upload Audio File</h1>
        
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        
        {audioURL && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Audio Preview:</p>
            <audio controls src={audioURL} className="w-full mt-2"></audio>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : "Upload & Process"}
        </button>
      </div>
    </div>
  );
}
