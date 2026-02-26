// App Configuration
const API_URL = "http://localhost:8000/api/chat";
const SOCKET_URL = "http://localhost:8000";

// App State
let socket;
let currentUser = '';
let currentReceiver = '';
let onlineUsers = [];

// DOM Elements
const loginSection = document.getElementById('loginSection');
const mainChat = document.getElementById('mainChat');
const usernameInput = document.getElementById('usernameInput');
const usernameDisplay = document.getElementById('usernameDisplay');
const onlineUsersContainer = document.getElementById('onlineUsers');
const chatWithUser = document.getElementById('chatWithUser');
const userStatus = document.getElementById('userStatus');
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const onlineCount = document.getElementById('onlineCount');

// Login Function
async function login() {
  const username = usernameInput.value.trim();
  
  if (!username) {
    alert('Please enter a username');
    return;
  }

  currentUser = username;
  usernameDisplay.textContent = username;
  
  // Connect to socket
  connectSocket();
  
  // Show main chat
  loginSection.style.display = 'none';
  mainChat.style.display = 'flex';
  
  // Load online users
  await loadOnlineUsers();
}

// Socket Connection
function connectSocket() {
  socket = io(SOCKET_URL);

  socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('join', currentUser);
  });

  socket.on('new_message', (data) => {
    if (data.sender === currentReceiver) {
      addMessage(data.message, 'received', data.sender, data.timestamp);
    }
  });

  socket.on('user_connected', (data) => {
    loadOnlineUsers();
  });

  socket.on('user_disconnected', (data) => {
    loadOnlineUsers();
  });
}

// Load Online Users
async function loadOnlineUsers() {
  try {
    const response = await fetch(`${API_URL}/users/online`);
    const data = await response.json();
    onlineUsers = data.users.filter(user => user !== currentUser);
    displayOnlineUsers();
  } catch (error) {
    console.error('Failed to load online users:', error);
  }
}

// Display Online Users
function displayOnlineUsers() {
  onlineCount.textContent = `${onlineUsers.length} online`;
  onlineUsersContainer.innerHTML = '';

  onlineUsers.forEach(user => {
    const userElement = createUserElement(user);
    onlineUsersContainer.appendChild(userElement);
  });

  // Add some demo users if list is empty
  if (onlineUsers.length === 0) {
    const demoUsers = ['Alice', 'Bob', 'Charlie', 'Diana'];
    demoUsers.forEach(user => {
      if (user !== currentUser) {
        const userElement = createUserElement(user, true);
        onlineUsersContainer.appendChild(userElement);
      }
    });
  }
}

// Create User Element
function createUserElement(username, isDemo = false) {
  const userDiv = document.createElement('div');
  userDiv.className = 'user-item';
  userDiv.onclick = () => selectUser(username);

  const avatar = document.createElement('div');
  avatar.className = 'user-avatar';
  avatar.textContent = username.charAt(0).toUpperCase();

  const userDetails = document.createElement('div');
  userDetails.className = 'user-details';

  const userName = document.createElement('div');
  userName.className = 'user-name';
  userName.textContent = username;

  const userStatusText = document.createElement('div');
  userStatusText.className = 'user-status-text';
  userStatusText.textContent = isDemo ? 'Demo User' : 'Online';

  userDetails.appendChild(userName);
  userDetails.appendChild(userStatusText);
  userDiv.appendChild(avatar);
  userDiv.appendChild(userDetails);

  return userDiv;
}

// Select User to Chat
async function selectUser(username) {
  currentReceiver = username;
  
  // Update UI
  document.querySelectorAll('.user-item').forEach(item => 
    item.classList.remove('active')
  );
  event.target.closest('.user-item').classList.add('active');
  
  chatWithUser.textContent = `Chatting with ${username}`;
  userStatus.textContent = '• Online';
  
  // Enable input
  messageInput.disabled = false;
  sendBtn.disabled = false;
  messageInput.focus();
  
  // Load conversation
  await loadConversation();
}

// Load Conversation
async function loadConversation() {
  try {
    const response = await fetch(`${API_URL}/conversation/${currentUser}/${currentReceiver}`);
    const data = await response.json();
    
    messagesContainer.innerHTML = '';
    
    if (data.messages && data.messages.length > 0) {
      data.messages.forEach(msg => {
        const messageType = msg.sender.username === currentUser ? 'sent' : 'received';
        addMessage(msg.message, messageType, msg.sender.username, msg.createdAt);
      });
    } else {
      messagesContainer.innerHTML = `
        <div class="welcome-message">
          <h3>Start a conversation with ${currentReceiver}! 👋</h3>
          <p>Send your first message below</p>
        </div>
      `;
    }
    
    scrollToBottom();
  } catch (error) {
    console.error('Failed to load conversation:', error);
  }
}

// Send Message
async function sendMessage() {
  const message = messageInput.value.trim();

  if (!message || !currentReceiver) return;

  try {
    const response = await fetch(`${API_URL}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: currentUser,
        receiver: currentReceiver, 
        message: message
      })
    });

    if (response.ok) {
      const data = await response.json();
      addMessage(data.message, 'sent', currentUser, data.timestamp);
      messageInput.value = '';
      messageInput.focus();
    } else {
      throw new Error('Failed to send message');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    alert('Failed to send message. Please try again.');
  }
}

// Add Message to Chat
function addMessage(text, type, sender, timestamp) {
  if (messagesContainer.querySelector('.welcome-message')) {
    messagesContainer.innerHTML = '';
  }

  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  
  const messageText = document.createElement('div');
  messageText.textContent = text;
  
  const messageTime = document.createElement('div');
  messageTime.className = 'message-time';
  messageTime.textContent = formatTime(timestamp);
  
  messageDiv.appendChild(messageText);
  messageDiv.appendChild(messageTime);
  
  messagesContainer.appendChild(messageDiv);
  scrollToBottom();
}

// Format Time
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

// Scroll to Bottom
function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Handle Enter Key Press
function handleEnterPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

// Auto-focus on username input
usernameInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    login();
  }
});

// Logout Function
function logout() {
  if (socket) {
    socket.disconnect();
  }
  
  currentUser = '';
  currentReceiver = '';
  onlineUsers = [];
  
  loginSection.style.display = 'flex';
  mainChat.style.display = 'none';
  usernameInput.value = '';
  messageInput.value = '';
  messagesContainer.innerHTML = '';
  onlineUsersContainer.innerHTML = '';
}

// Auto-focus username input on load
window.addEventListener('load', () => {
  usernameInput.focus();
});

// Auto-load online users every 10 seconds
setInterval(() => {
  if (currentUser) {
    loadOnlineUsers();
  }
}, 10000);