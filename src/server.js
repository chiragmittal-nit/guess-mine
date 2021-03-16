import express from "express";
import path from "path";
const socketIO = require("socket.io");

const PORT = 3000;
const app = express();

app.set("view engine", "pug");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  res.render("home");
});

const server = app.listen(PORT, () =>
  console.log(`server running : http://localhost:${PORT}`)
);

const io = socketIO(server);
