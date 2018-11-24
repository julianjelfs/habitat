const rn = require("random-number");
const options = { min: -20, max: 60, integer: true };
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = 3000;

app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use(express.static(__dirname + "/static"));

app.get("/", (req, res) => {
  res.render("index");
});

function toFaranheit(c) {
  return Math.floor((c * 9) / 5 + 32);
}

let minmax = {
  min: 0,
  max: 0
};

function updateMinMax(c) {
  minmax = {
    min: c < minmax.min ? c : minmax.min,
    max: c > minmax.max ? c : minmax.max
  };
}

setInterval(() => {
  const c = rn(options);
  updateMinMax(c);
  io.emit("temperature", {
    ...minmax,
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
