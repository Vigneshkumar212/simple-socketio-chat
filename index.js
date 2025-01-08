import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(express.static("./app"))
const port = 3000;


const data = {
  users: [],
  usernames: [],
  messages:[]
}

io.on('connection', async (socket) => {
  console.log("A user connected:", socket.id);

    
    socket.on('chat message', async (msg, clientOffset, callback) => {
      data.messages.push(msg)
      io.emit('chat message', msg);
      callback();
    });
  

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});