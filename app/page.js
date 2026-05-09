import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BarChart2, MessageSquare, Upload, Zap } from "lucide-react";

export default async function LandingPage() {
   const { userId } = await auth();
  if (userId) redirect("/dashboard");
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-violet-400">DataSense AI 📊</h1>
        <div className="flex gap-3">
          <Link href="/sign-in" className="px-5 py-2 text-gray-300 hover:text-white transition">
            Sign In
          </Link>
          <Link href="/sign-up" className="px-5 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl font-medium transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-24 px-8">
        <div className="inline-block bg-violet-900/40 text-violet-300 text-sm px-4 py-1.5 rounded-full mb-6 border border-violet-700">
          ✨ AI-Powered Data Analysis
        </div>
        <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Turn your CSV into
          <span className="text-violet-400"> instant insights</span>
        </h2>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
          Upload any CSV file and get beautiful charts, stats, and an AI assistant that answers questions about your data in plain English.
        </p>
        <Link href="/sign-up" className="inline-block bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition">
          Start for Free →
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 pb-24 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            icon: <Upload className="text-violet-400" size={28} />,
            title: "Easy CSV Upload",
            desc: "Drag & drop any CSV file. No setup, no configuration. Just upload and go.",
          },
          {
            icon: <BarChart2 className="text-violet-400" size={28} />,
            title: "Instant Visualizations",
            desc: "Auto-generated bar charts, line graphs, and pie charts from your data in seconds.",
          },
          {
            icon: <MessageSquare className="text-violet-400" size={28} />,
            title: "Chat with your Data",
            desc: "Ask questions in plain English. Our AI reads your dataset and gives smart answers.",
          },
          {
            icon: <Zap className="text-violet-400" size={28} />,
            title: "Powered by LLaMA 3.3",
            desc: "Backed by one of the most powerful open-source AI models for accurate analysis.",
          },
        ].map((f, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex gap-4">
            <div className="mt-1">{f.icon}</div>
            <div>
              <h3 className="text-lg font-semibold mb-1">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 pb-8 text-sm">
        Built with Next.js · Groq AI · Recharts
      </footer>
    </main>
  );
}