const { log } = require("console");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

let total_client=new Set()

io.on("connection",(socket)=>{
    console.log("connected",socket.id);
    total_client.add(socket.id)
    io.emit("client-joined",socket.id)
    io.emit("totalclients",total_client.size)
    socket.on("message",(data)=>{
        console.log(data);
    socket.broadcast.emit("chat-message",data)
    })
    socket.on("disconnect",()=>{
        console.log(socket.id)
        total_client.delete(socket.id)
        io.emit("client-left",socket.id)
        io.emit("totalclients",total_client.size)

    })
})

httpServer.listen(3000,()=>{
    console.log("server is runnin");
});

