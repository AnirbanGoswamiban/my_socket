const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer);
const port = process.env.PORT || 3000;

let total_clients = new Set();

io.on("connection", (socket) => {
  console.log("Connected", socket.id);
  total_clients.add(socket.id);
  io.emit("client-joined", socket.id);
  io.emit("total-clients", total_clients.size);

  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("disconnect", () => {
    console.log(socket.id);
    total_clients.delete(socket.id);
    io.emit("client-left", socket.id);
    io.emit("total-clients", total_clients.size);
  });
});

httpServer.listen(port, () => {
  console.log(`Socket server is running on port ${port}`);
});
