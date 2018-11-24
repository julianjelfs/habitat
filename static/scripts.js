window.onload = () => {
  const socket = io();
  socket.on("temperature", msg => {
    document.querySelector(".temp").textContent = `${msg.c} °C`;
    document.querySelector(".min").textContent = `${msg.min} °C`;
    document.querySelector(".max").textContent = `${msg.max} °C`;
  });
  document.querySelector(".pig").addEventListener("click", () => {
    socket.emit("reset");
  });
};
