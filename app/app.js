/*



 */
let counter = 0;

const socket = io({
  auth: {
    serverOffset: 0
  },
  ackTimeout: 10000,
  retries: 3,
});

class Main {
  constructor() {
    this.getUseableUsername().then(name => {
      this.username = name
    window.username = this.username
      const clientOffset = `${socket.id}-${counter++}`;
      socket.emit('chat message', { username: this.username, value: JSON.stringify("joined the chat"), timestamp: Date.now() }, clientOffset);
    })

    this.initFormActivation()
  }

  getUseableUsername() {
    return new Promise((res, rej) => {
      const name = "vk"//window.prompt("Choose a username")
      res(name)
    })
  }

  initFormActivation() {
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        if (event.shiftKey) {
          // Allow Shift+Enter to add a new line
          return;
        } else {
          // Prevent default Enter behavior (new line)
          event.preventDefault();

          // Get the message
          const message = input.value.trim();

          if (message) {
            const clientOffset = `${socket.id}-${counter++}`;
            console.log(window.username);
            
            socket.emit('chat message',{username: window.username, value: JSON.stringify(input.value), timestamp : Date.now()}, clientOffset);
            input.value = '';
          }
        }
      }

      const val = input.value;
      const lines = val.split("\n").length+1
      const height = lines*20
      input.style.height = height+"px"
    });


    socket.on('chat message', (msg, serverOffset) => {
      console.log(msg);

      const item = document.createElement('div');
      item.classList.add("message")
      item.innerHTML = `<div class="from">${msg.username}</div> <div class="content"></div> <div class="time">${new Date(msg.timestamp).toLocaleString()}</div>`;
      item.querySelectorAll(".content")[0].innerHTML = JSON.parse(msg.value).replace(/\n/g, '<br>');
      messages.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);
      socket.auth.serverOffset = serverOffset;
    });
  }
}
const main = new Main()