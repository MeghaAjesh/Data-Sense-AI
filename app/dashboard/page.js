"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";
import ChatInterface from "@/components/ChatInterface";
import { History, X, FileSpreadsheet, ChevronRight } from "lucide-react";

const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  { ssr: false }
);

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [fileName, setFileName] = useState("");
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("datasense_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleDataLoaded = (parsedData, fields, name) => {
    setData(parsedData);
    setColumns(fields);
    setFileName(name);

    const newEntry = {
      id: Date.now(),
      name,
      rows: parsedData.length,
      columns: fields.length,
      date: new Date().toLocaleDateString(),
      data: parsedData,
      fields,
    };

    setHistory((prev) => {
      const updated = [newEntry, ...prev.filter((h) => h.name !== name)].slice(0, 8);
      localStorage.setItem("datasense_history", JSON.stringify(updated));
      return updated;
    });
  };

  const loadFromHistory = (entry) => {
    setData(entry.data);
    setColumns(entry.fields);
    setFileName(entry.name);
  };

  const deleteHistory = (id, e) => {
    e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      localStorage.setItem("datasense_history", JSON.stringify(updated));
      return updated;
    });
  };

  const reset = () => {
    setData(null);
    setColumns([]);
    setFileName("");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 overflow-hidden flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col`}>
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <History size={16} /> History
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {history.length === 0 ? (
            <p className="text-gray-600 text-sm text-center mt-8">No uploads yet</p>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                onClick={() => loadFromHistory(entry)}
                className={`group flex items-start justify-between p-3 rounded-xl cursor-pointer transition
                  ${fileName === entry.name ? "bg-violet-900/50 border border-violet-700" : "hover:bg-gray-800"}`}
              >
                <div className="flex gap-2 overflow-hidden">
                  <FileSpreadsheet size={16} className="text-violet-400 mt-0.5 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-sm text-gray-200 truncate">{entry.name}</p>
                    <p className="text-xs text-gray-500">{entry.rows} rows · {entry.date}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => deleteHistory(entry.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition ml-1 flex-shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white transition"
            >
              <ChevronRight size={20} className={`transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
            </button>
            <h1 className="text-2xl font-bold text-violet-400">DataSense AI 📊</h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </nav>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {!data ? (
              <FileUpload onDataLoaded={handleDataLoaded} />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-gray-900 rounded-2xl p-4 border border-gray-800">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet size={22} className="text-violet-400" />
                    <div>
                      <p className="text-white font-semibold">{fileName}</p>
                      <p className="text-gray-500 text-sm">{data.length} rows · {columns.length} columns · {columns.join(", ")}</p>
                    </div>
                  </div>
                  <button
                    onClick={reset}
                    className="text-sm text-gray-400 hover:text-white border border-gray-700 px-4 py-2 rounded-xl transition"
                  >
                    Upload New File
                  </button>
                </div>
                <Dashboard data={data} columns={columns} />
                <ChatInterface data={data} columns={columns} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}