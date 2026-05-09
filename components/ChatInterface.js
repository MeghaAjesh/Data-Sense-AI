"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

export default function ChatInterface({ data, columns }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hi! I've analyzed your dataset. It has **${data.length} rows** and **${columns.length} columns** (${columns.join(", ")}). Ask me anything about your data! 🚀`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const buildSummary = () => {
    const sample = data.slice(0, 20);
    return `Columns: ${columns.join(", ")}
Total rows: ${data.length}
Sample data (first 20 rows): ${JSON.stringify(sample)}`;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          dataSummary: buildSummary(),
        }),
      });

      const { reply } = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^• /gm, "• ")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className="bg-gray-900 rounded-2xl flex flex-col h-[500px] border border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-2">
        <Bot className="text-violet-400" size={20} />
        <h3 className="font-semibold text-gray-200">Ask AI about your data</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
              ${msg.role === "assistant" ? "bg-violet-600" : "bg-gray-700"}`}>
              {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${msg.role === "assistant"
                  ? "bg-gray-800 text-gray-200 rounded-tl-none"
                  : "bg-violet-600 text-white rounded-tr-none"}`}
              dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
            />
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something like: What are the trends in this data?"
          className="flex-1 bg-gray-800 text-gray-200 placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white px-4 py-3 rounded-xl transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}