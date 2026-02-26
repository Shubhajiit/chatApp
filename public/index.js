const API_URL = "http://localhost:5000/api/chat/send";
const SOCKET_URL = "http://localhost:5000";
let socket;

function connectSocket() {
  const sender = document.getElementById("sender").value;

  socket = io(SOCKET_URL);

  socket.on("connect", () => {
    socket.emit("join", sender);
    alert("Connected to chat");
  });

  socket.on("new_message", (data) => {
    addMessage(data.message, "received");
  });
}

async function sendMessage() {
  const sender = document.getElementById("sender").value;
  const receiver = document.getElementById("receiver").value;
  const message = document.getElementById("messageInput").value;

  if (!message) return;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ sender, receiver, message })
  });

  const data = await res.json();
  addMessage(data.message, "sent");
  document.getElementById("messageInput").value = "";
}

function addMessage(text, type) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${type}`;
  msgDiv.innerText = text;

  document.getElementById("messages").appendChild(msgDiv);
  document.getElementById("messages").scrollTop = 9999;
}