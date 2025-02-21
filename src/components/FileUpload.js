"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function FileUpload({ setFile }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="w-80 h-40 border-2 border-dashed border-gray-400 flex items-center justify-center bg-white p-4 rounded-md cursor-pointer"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-gray-600">Drop the file here...</p>
      ) : (
        <p className="text-gray-600">Drag & drop an audio file here, or click to select</p>
      )}
    </div>
  );
}
