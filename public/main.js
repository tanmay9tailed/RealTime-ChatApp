const socket = io();
const totalClients = document.querySelector("h3");
const nameInput = document.querySelector(".name-input");
const msgContainer = document.querySelector(".chat-container");
const msgForm = document.querySelector(".msg-input");
const msgInput = document.querySelector("#message-text");
const msgTone = new Audio('./tone.wav')

msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("clients-total", (data) => {
  totalClients.innerText = `Total Clients : ${data}`;
});

function sendMessage() {
  if (msgInput.value === "") return;
  const data = {
    name: nameInput.value,
    message: msgInput.value,
    dateTime: new Date(),
  };
  socket.emit("message", data);
  addMessage(true, data);
  msgInput.value = "";
}

socket.on("chat-message", (data) => {
  msgTone.play();
  addMessage(false, data);
});

function addMessage(isOwnMessage, data) {
  clearFeedback()
  const sideClass = isOwnMessage ? "right-msg" : "left-msg";
  const messageElement = document.createElement("li");
  messageElement.classList.add(sideClass);

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("msg");
  messageDiv.textContent = data.message;

  const dateDiv = document.createElement("div");
  dateDiv.classList.add("Date");
  dateDiv.textContent = `${data.name} | few seconds ago`; // Assuming you have moment.js included

  messageElement.appendChild(messageDiv);
  messageElement.appendChild(dateDiv);

  msgContainer.appendChild(messageElement);
  scrollToBottom();
}

function scrollToBottom() {
  msgContainer.scrollTo(0, msgContainer.scrollHeight);
}

msgInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing message`,
  });
});
msgInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing...`,
  });
});
msgInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: ``,
  });
});

socket.on("feedback", (data) => {
  clearFeedback()
  const ele = `<li class="msg-feedback">
  <p class="feedback">${data.feedback}</p>
</li>`;

  msgContainer.innerHTML += ele;
  console.log("donnnneeeeee")
});

function clearFeedback(){
  document.querySelectorAll('.msg-feedback').forEach(e => {
    e.remove(e);
  })
}