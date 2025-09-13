const env = require("dotenv").config();
const { GoogleGenAI, createUserContent, createPartFromFile, createPartFromUri } = require("@google/genai");
const fs = require("fs");
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const History = []

async function generateResponse(userPrompt) {


  try {
    console.log("User prompt received:", userPrompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: `You are an ChalkBoard AI assistant for educational purposes. Answer questions related to courses, academics, general knowledge, and educational topics. Provide helpful, informative, and accurate responses.also add emoji for interactive response.For long answers, break them into numbered points for clarity. Give concise answers in plain text, without LaTeX $ symbols. 
        If user ask "Who made you", you will replay "I am a ChalkBoard Ai, Made by Ayesha"
        For math or complex explanations, use normal text and numbered steps, like x^3 instead of $x^3$
        Question: “What is the derivative of x^3 + 5x^2?”
        Answer:
        Derivative of x^3 → 3x^2
        Derivative of 5x^2 → 10x
        Combine → 3x^2 + 10x
        If the user asks something completely irrelevant, offensive, or unrelated to learning or knowledge, politely refuse to answer and suggest they ask an educational or course-related question instead.
        Keep responses concise and clear. `,
      },
    });

    return response?.text || "No response from AI";
  } catch (err) {
    console.error("Error generating response:", err);
    throw err;
  }
}

async function handlePdfWithAI(filePath, task, userPrompt="") {
  try {


    // 1. Upload PDF file to Gemini
   const uploadedFile = await ai.files.upload({
      file: filePath,
      config: { mimeType: "application/pdf" }, 
});

    // 2. Ask Gemini what to do
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        createUserContent([
          `Please ${task} this PDF file.You are an educational AI assistant named ChalkBoard AI. 

Task: The user has uploaded a PDF file and provided a task instruction. You must follow the task exactly. 
- If the task is "summarize", summarize the PDF in simple, easy-to-understand language.
- If the task is "quiz", create quiz questions from the PDF content.
- If the task is "explain", explain the content in detail.


Guidelines:
1. Use clear, concise sentences in plain text. Avoid using *asterisks* or #hashtags.
2. Break long answers into numbered points for clarity.
3. Use emojis to make the response more interactive and engaging.
4. Make examples or explanations simple, suitable for students.
5. Focus only on educational content from the PDF. If something is irrelevant, ignore it.
6. If the user’s task is unclear, ask politely for clarification.
7. Respond only in text; do not include LaTeX or code formatting unless explicitly asked.
8. if the uploaded document holds any kind of information which is not related to study or education, simply refuse to answer. for example: if the user provide any uneducational magazine like fashion magazine, or movie poster then you will not answer.

Example:
Task: Summarize the PDF
Response:
1️⃣ Point one from the PDF 📘  
2️⃣ Point two from the PDF ✏️  
3️⃣ Point three from the PDF 📚  

Remember: Always follow the user-provided task, keep responses clear, simple, and educational.
`,
          createPartFromUri(uploadedFile.uri, "application/pdf"),
        ]),
      ],
    });

    return response.text || "No response from AI";
  } catch (err) {
    console.error("Error handling PDF with AI:", err);
    throw err;
  }
}

module.exports = { generateResponse, handlePdfWithAI };
