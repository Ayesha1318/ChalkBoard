const sendButton = document.getElementById("sendButton");
const messageInput = document.getElementById("messageInput");
const chatArea = document.getElementById("chatArea");
const welcomeMessage = document.querySelector(".welcome-message");
const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
const uploadedFileContainer = document.getElementById("uploadedFileContainer");

// ------------------ Message Section -------------------
function removeWelcome() {
  if (welcomeMessage) {
    welcomeMessage.style.display = "none";
  }
}

messageInput.addEventListener("input", () => {
  messageInput.style.height = messageInput.scrollHeight + "px";
});

function addMessage(text, sender = "user", fileName = null, fileObj = null) {
  removeWelcome();
  const msgDiv = document.createElement("div");
  msgDiv.className = sender === "user" ? "user-msg" : "ai-msg";

  if (fileName && fileObj) {
    // Show file in chat bubble
    const fileWrapper = document.createElement("div");
    fileWrapper.className = "file-msg";
    const icon = document.createElement("span");
    icon.textContent = "📄";
    icon.style.marginRight = "8px";

    const link = document.createElement("a");
    link.href = URL.createObjectURL(fileObj);
    link.target = "_blank";
    link.textContent = fileName;
    link.style.textDecoration = "underline";
    link.style.color = sender === "user" ? "white" : "black";

    fileWrapper.appendChild(icon);
    fileWrapper.appendChild(link);

    if (text) {
      msgDiv.innerHTML = text + "<br>";
    }
    msgDiv.appendChild(fileWrapper);
  } else {
    msgDiv.textContent = text;
  }

  chatArea.appendChild(msgDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// ------------------ File Section -------------------
let uploadedFile = null;

uploadButton.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  uploadedFile = event.target.files[0];
  if (!uploadedFile) return;

  // Show file badge in input area
  uploadedFileContainer.innerHTML = `
    <div class="file-badge">
      📄 ${uploadedFile.name} <span id="removeFile">&times;</span>
    </div>
  `;

   const removeBtn = document.getElementById("removeFile");
  removeBtn.addEventListener("click", () => {
    uploadedFile = null;
    uploadedFileContainer.innerHTML = "";
  });
});

// ------------------ Send Section -------------------
async function sendMessage() {
  const messageText = messageInput.value.trim();
  if (!messageText && !uploadedFile) return;

  // Show user message + PDF in chat
  addMessage(messageText || "Sent a file", "user", uploadedFile?.name, uploadedFile);

  // Reset input box
  messageInput.value = "";
  messageInput.style.height = "53px";

  // Prepare form data
  const formData = new FormData();
  if (uploadedFile) formData.append("pdfFile", uploadedFile);
  if (messageText) formData.append("task", messageText);

  // Remove file from input and UI immediately 
  uploadedFileContainer.innerHTML = "";
  fileInput.value = "";
  const fileToSend = uploadedFile; // keep reference for sending
  uploadedFile = null;

  // AI typing bubble
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

  try {
    const url = fileToSend ? "/upload-pdf" : "/ai-response";
    const res = await fetch(url, {
      method: "POST",
      body: fileToSend ? formData : JSON.stringify({ messageInput: messageText }),
      headers: fileToSend ? {} : { "Content-Type": "application/json" },
    });

    const data = await res.json();
    clearInterval(dotsInterval);

    // Determine AI response text
    const aiText = data.code || data.result || "Error generating response";

    // Display word by word
    typingBubble.textContent = "";
    const words = aiText.split(" ");
    let index = 0;
    const wordInterval = setInterval(() => {
      typingBubble.textContent += words[index] + " ";
      chatArea.scrollTop = chatArea.scrollHeight;
      index++;
      if (index >= words.length) clearInterval(wordInterval);
    }, 20);

  } catch (err) {
    clearInterval(dotsInterval);
    typingBubble.textContent = "Error connecting to server";
    console.error(err);
  }
}


// Send message on button click or Enter
sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});
