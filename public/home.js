const sendButton = document.getElementById("sendButton");
const messageInput = document.getElementById("messageInput");
const chatArea = document.getElementById("chatArea");
const welcomeMessage = document.querySelector(".welcome-message");
 const fileInput = document.getElementById("fileInput");
 const uploadButton = document.getElementById("uploadButton");


//  <------------------msg section----------------------->
function removeWelcome() {
  if (welcomeMessage) {
    welcomeMessage.style.display = "none";
  }
}

messageInput.addEventListener("input", () => {
  messageInput.style.height = messageInput.scrollHeight + "px";
});


function addMessage(text, sender = "user") {
  removeWelcome();
  const msgDiv = document.createElement("div");
  msgDiv.className = sender === "user" ? "user-msg" : "ai-msg";
  msgDiv.textContent = text;
  chatArea.appendChild(msgDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}


async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  addMessage(message, "user");

  // Reset input
  messageInput.value = "";
  messageInput.style.height = "53px";

 // Show AI typing bubble
  const typingBubble = document.createElement("div");
  typingBubble.className = "ai-msg typing-msg";
  typingBubble.textContent = "......";
  chatArea.appendChild(typingBubble);
  chatArea.scrollTop = chatArea.scrollHeight;

  let dots = 0;
  const interval = setInterval(() => {
    dots = (dots + 1) % 4;
    typingBubble.textContent = ".".repeat(dots);
  }, 300);

  
  try {
    const res = await fetch("/ai-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageInput: message }) // ✅ fixed
    });

    const data = await res.json();
   // <---------ai response----------->

      clearInterval(interval); // stop typing dots

    if (data.code) {
      typingBubble.textContent = "";
      let index = 0;
      const typeInterval = setInterval(() => {
        typingBubble.textContent += data.code[index];
        chatArea.scrollTop = chatArea.scrollHeight;
        index++;
        if (index >= data.code.length) clearInterval(typeInterval);
      }, 20);
    } else {
      typingBubble.textContent = "Error generating response.";
    }
  } catch (err) {
    clearInterval(interval);
    typingBubble.textContent = "Error connecting to server.";
    console.error(err);
  }
}

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});


// <---------file section--------------->

uploadButton.addEventListener("click", () => {
    fileInput.click();
  });




