import express from "express";
import http from "http";
import { Server } from "socket.io";
const port = 8080;
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on("connection",()=>{
    console.log("user is connected")
})
httpServer.listen(port, () => {
  console.log(`listening to port ${port}`);
});
