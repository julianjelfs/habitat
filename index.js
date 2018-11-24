const rn = require("random-number");
const options = { min: -20, max: 60, integer: true };
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = 3000;

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("static"));

app.get("/", (req, res) => {
  res.render("index");
});

function toFaranheit(c) {
  return Math.floor((c * 9) / 5 + 32);
}

setInterval(() => {
  const c = rn(options);
  io.emit("temperature", {
    c,
    f: toFaranheit(c)
  });
}, 1000);

io.on("connection", socket => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

http.listen(port, () => console.log(`Listening on port ${port}`));
