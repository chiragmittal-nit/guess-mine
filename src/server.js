import express from "express";
import http from "http";
import path from "path";
import socketIO from "socket.io";

import socketController from "./socketController";
import events from "./events.js";
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("home", { title: "Guess Mine", events });
});

// socketIO expects a raw httpserver,which express creates
// behind the scene hence we need to create it explicitly.

const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () =>
  console.log(`server running : http://127.0.0.1:${PORT}`)
);

io.on("connection", (socket) => socketController(socket, io));
