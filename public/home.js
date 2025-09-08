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

function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  addMessage(message, "user");

  messageInput.value = "";
  messageInput.style.height = "53px";

  const typingBubble = document.createElement("div");
  typingBubble.className = "ai-msg typing-msg";
  typingBubble.textContent = "......";
  chatArea.appendChild(typingBubble);

  let dots = 0;
  const interval = setInterval(() => {
    dots = (dots + 1) % 4;
    typingBubble.textContent = "." + ".".repeat(dots);
  }, 300);

  setTimeout(() => {
    clearInterval(interval);
    const aiText =
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi voluptatem nulla quia enim, aperiam unde delectus eaque, incidunt esse perferendis nihil sequi omnis asperiores provident iste ea illum veniam hic voluptatum nesciunt minus veritatis nam! Ea nesciunt sint fuga harum optio, temporibus eligendi molestiae illo odit commodi ipsam voluptate repellat, quos id, impedit iste aperiam porro itaque quaerat. Voluptate soluta perspiciatis, quo voluptatibus sint illum ducimus delectus sunt? Nobis voluptas id culpa? Quos tempore quas modi architecto temporibus nisi sed perspiciatis possimus. Nesciunt quae necessitatibus maiores voluptatibus distinctio illo explicabo minus ut fugiat et voluptatum dolorum unde, voluptas magnam laudantium praesentium veniam non accusamus adipisci nam.";
    typingBubble.textContent = ""; // clear dots

    let index = 0;
    const typeInterval = setInterval(() => {
      typingBubble.textContent += aiText[index];
      index++;
      chatArea.scrollTop = chatArea.scrollHeight;

      if (index >= aiText.length) {
        clearInterval(typeInterval);
      }
    }, 20);
  }, 2000);
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




