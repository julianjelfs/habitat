const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = 3000;
const dataPath = __dirname + "/data/dummy";
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const uploadFreq = 60000;
let lastUpload = 0;

app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use(express.static(__dirname + "/static"));

app.get("/", (req, res) => {
  res.render("index");
});

function sendToAws(data) {
  const now = +new Date();
  if (now - lastUpload < uploadFreq) return;
  lastUpload = +new Date();

  s3.putObject(
    {
      Bucket: "gp-habitat",
      Key: "temp.json",
      Body: Buffer.from(JSON.stringify(data)),
      ACL: "public-read"
    },
    function(err, data) {
      if (err) {
        console.log(`Error uploading to AWS: ${err}`);
      } else {
        console.log(`Successfully uploaded to AWS: ${data}`);
      }
    }
  );
}

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
    const msg = {
      ...minmax,
      c,
      f: toFaranheit(c)
    };
    sendToAws(msg);
    io.emit("temperature", msg);
  });
}, 500);

io.on("connection", socket => {
  socket.on("reset", () => (minmax = { min: 0, max: 0 }));
});

http.listen(port, () => console.log(`Listening on port ${port}`));
