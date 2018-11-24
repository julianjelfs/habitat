function fixed(n) {
  return n && n.toFixed(1);
}

window.onload = () => {
  const socket = io();
  socket.on("temperature", msg => {
    document.querySelector(".temp").textContent = `${fixed(msg.c)} °C`;
    document.querySelector(".min").textContent = `${fixed(msg.min)} °C`;
    document.querySelector(".max").textContent = `${fixed(msg.max)} °C`;
  });
  document.querySelector(".pig").addEventListener("click", () => {
    socket.emit("reset");
  });
};
