const sendButton = document.getElementById("sendButton");
const messageInput = document.getElementById("messageInput");
const chatArea = document.getElementById("chatArea");
const welcomeMessage = document.querySelector(".welcome-message");
const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
const uploadedFileContainer = document.getElementById("uploadedFileContainer");

let uploadedFile = null;

// ------------------ Utility Functions -------------------
function removeWelcome() {
  if (welcomeMessage) welcomeMessage.style.display = "none";
}

function addMessage(text, sender = "user", fileName = null, fileObj = null) {
  removeWelcome();
  const msgDiv = document.createElement("div");
  msgDiv.className = sender === "user" ? "user-msg" : "ai-msg";

  if (fileName && fileObj) {
    const fileWrapper = document.createElement("div");
    fileWrapper.className = "file-msg";
    const icon = document.createElement("span");
    icon.style.marginRight = "8px";

    const link = document.createElement("a");
    link.href = URL.createObjectURL(fileObj);
    link.target = "_blank";
    link.textContent = fileName;
    link.style.textDecoration = "underline";
    link.style.color = sender === "user" ? "white" : "black";

    fileWrapper.appendChild(icon);
    fileWrapper.appendChild(link);

    if (text) msgDiv.innerHTML = text + "<br>";
    msgDiv.appendChild(fileWrapper);
  } else {
    msgDiv.textContent = text;
  }

  chatArea.appendChild(msgDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Create AI typing bubble and return the element + interval
function createTypingBubble() {
  const typingBubble = document.createElement("div");
  typingBubble.className = "ai-msg typing-msg";
  typingBubble.textContent = "......";
  chatArea.appendChild(typingBubble);
  chatArea.scrollTop = chatArea.scrollHeight;

  let dots = 0;
  const dotsInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    typingBubble.textContent = ".".repeat(dots);
    chatArea.scrollTop = chatArea.scrollHeight;
  }, 300);

  return { typingBubble, dotsInterval };
}

// Display AI response word by word in a given element
function displayAIResponseWordByWord(aiText, bubbleElement) {
  bubbleElement.textContent = "";
  const words = aiText.split(" ");
  let index = 0;
  const wordInterval = setInterval(() => {
    bubbleElement.textContent += words[index] + " ";
    chatArea.scrollTop = chatArea.scrollHeight;
    index++;
    if (index >= words.length) clearInterval(wordInterval);
  }, 20);
}

// ------------------ File Section -------------------
uploadButton.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (event) => {
  uploadedFile = event.target.files[0];
  if (!uploadedFile) return;

  uploadedFileContainer.innerHTML = `
    <div class="file-badge">
       ${uploadedFile.name} <span id="removeFile">&times;</span>
    </div>
  `;

  document.getElementById("removeFile").addEventListener("click", () => {
    uploadedFile = null;
    uploadedFileContainer.innerHTML = "";
  });
});

// ------------------ Send Section -------------------
async function sendMessage(messageText = null, fileObj = null) {
  const text = messageText || messageInput.value.trim();
  if (!text && !fileObj) return;

  // Show user message + file
  addMessage(text || "Sent a file", "user", fileObj?.name, fileObj || uploadedFile);

  // Reset input
  messageInput.value = "";
  messageInput.style.height = "53px";

  // Prepare form data
  const formData = new FormData();
  if (fileObj || uploadedFile) formData.append("pdfFile", fileObj || uploadedFile);
  if (text) formData.append("task", text);

  // Remove uploaded file UI immediately
  uploadedFileContainer.innerHTML = "";
  const fileToSend = uploadedFile || fileObj;
  uploadedFile = null;

  const { typingBubble, dotsInterval } = createTypingBubble();

  try {
    const url = fileToSend ? "/upload-pdf" : "/ai-response";
    const res = await fetch(url, {
      method: "POST",
      body: fileToSend ? formData : JSON.stringify({ messageInput: text }),
      headers: fileToSend ? {} : { "Content-Type": "application/json" },
    });

    const data = await res.json();
    clearInterval(dotsInterval);

    const aiText = data.code || data.result || "Error generating response";
    displayAIResponseWordByWord(aiText, typingBubble);

  } catch (err) {
    clearInterval(dotsInterval);
    console.error(err);
    typingBubble.textContent = "Error connecting to server";
  }
}

// Send message on click or Enter
sendButton.addEventListener("click", () => sendMessage());
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

// ------------------ Auto-send PDF and task -------------------
window.addEventListener("DOMContentLoaded", async () => {
  const autoPdfPath = document.getElementById("autoPdf")?.value;
  const autoTask = document.getElementById("autoTask")?.value;

  if (autoPdfPath && autoTask) {
    try {
      const response = await fetch(autoPdfPath);
      const pdfBlob = await response.blob();
      const file = new File([pdfBlob], autoPdfPath.split("/").pop(), { type: "application/pdf" });

      sendMessage(autoTask, file);
    } catch (err) {
      console.error(err);
    }
  }
});