(function() {
  const temp = document.getElementById("temp");
  console.log(temp);
  const socket = io();
  socket.on("temperature", msg => {
    document.getElementById("temp").textContent = `${msg.c} °C`;
  });
})();
