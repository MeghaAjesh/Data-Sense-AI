import { NextResponse } from "next/server";

export async function POST(request) {
  const { message, dataSummary } = await request.json();

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1024,
        messages: [
          {
            role: "system",
            content: `You are a data analyst AI assistant. The user has uploaded a CSV dataset.
Here is a summary of their data:
${dataSummary}

Answer questions about this data clearly and concisely. Give insights, patterns, and observations.
Keep responses short and friendly. Use bullet points when listing multiple things.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const result = await response.json();
    console.log("Groq response:", JSON.stringify(result, null, 2));

    const reply = result.choices[0].message.content;
    return NextResponse.json({ reply });

  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ reply: "Server error. Please try again." });
  }
}