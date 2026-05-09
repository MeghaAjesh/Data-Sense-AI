"use client";
import { useState } from "react";
import Papa from "papaparse";
import { UploadCloud, Loader2 } from "lucide-react";

export default function FileUpload({ onDataLoaded }) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFile = (file) => {
    if (!file || !file.name.endsWith(".csv")) {
      alert("Please upload a valid CSV file.");
      return;
    }

    setFileName(file.name);
    setLoading(true);

    setTimeout(() => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        worker: false,
        complete: (results) => {
          const limitedData = results.data.slice(0, 5000);
          setLoading(false);
          onDataLoaded(limitedData, results.meta.fields, file.name);
        },
        error: () => {
          setLoading(false);
          alert("Error reading file. Please try again.");
        },
      });
    }, 100);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  if (loading) {
    return (
      <div className="border-2 border-dashed border-violet-500 rounded-2xl p-16 text-center bg-gray-900">
        <Loader2 className="mx-auto mb-4 text-violet-400 animate-spin" size={52} />
        <p className="text-xl font-semibold text-gray-200">Parsing {fileName}...</p>
        <p className="text-gray-500 mt-2">This may take a moment for large files</p>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300
        ${dragging ? "border-violet-400 bg-violet-950" : "border-gray-600 bg-gray-900 hover:border-violet-500"}`}
    >
      <UploadCloud className="mx-auto mb-4 text-violet-400" size={52} />
      <p className="text-xl font-semibold text-gray-200">Drag & drop your CSV file here</p>
      <p className="text-gray-500 mt-2 mb-6">or click the button below · max 5,000 rows processed</p>
      <label className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-medium transition">
        Browse File
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </label>
    </div>
  );
}