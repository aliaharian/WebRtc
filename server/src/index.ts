import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { roomHandler } from "./room";
const port = 8080;
const app = express();
app.use(cors);
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user is connected: ", socket.id);
  roomHandler(socket);
  socket.on("disconnect", () => {
    console.log("user is Discnnected");
  });
});

httpServer.listen(port, () => {
  console.log(`listening to port ${port}`);
});
