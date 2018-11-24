const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = 3000;
const dataPath = __dirname + "/data/dummy";

app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use(express.static(__dirname + "/static"));

app.get("/", (req, res) => {
  res.render("index");
});

function getTemperature(cb) {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err == null) cb(parseInt(data.match(/t=(\d+)/)[1]) / 1000);
  });
}

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
  getTemperature(c => {
    updateMinMax(c);
    io.emit("temperature", {
      ...minmax,
      c,
      f: toFaranheit(c)
    });
  });
}, 1000);

io.on("connection", socket => {
  socket.on("reset", () => (minmax = { min: 0, max: 0 }));
});

http.listen(port, () => console.log(`Listening on port ${port}`));
