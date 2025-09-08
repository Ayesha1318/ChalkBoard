const env = require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function generateResponse(userPrompt) {
  try {
    console.log("User prompt received:", userPrompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: `
        You are an ChalkBoard AI assistant for educational purposes. Answer questions related to courses, academics, general knowledge, and educational topics. Provide helpful, informative, and accurate responses.also add emoji for interactive response.For long answers, break them into numbered points for clarity. Give concise answers in plain text, without LaTeX $ symbols.
        For math or complex explanations, use normal text and numbered steps, like x^3 instead of $x^3$
        Question: “What is the derivative of x^3 + 5x^2?”
        Answer:
        Derivative of x^3 → 3x^2
        Derivative of 5x^2 → 10x
        Combine → 3x^2 + 10x
        If the user asks something completely irrelevant, offensive, or unrelated to learning or knowledge, politely refuse to answer and suggest they ask an educational or course-related question instead.
        Keep responses concise and clear.`,
      },
    });

    return response?.text || "No response from AI";
  } catch (err) {
    console.error("Error generating response:", err);
    throw err;
  }
}

module.exports = { generateResponse };
