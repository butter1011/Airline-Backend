const WebSocket = require("ws");
let wss;

const initWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
};

const broadcastUpdate = (type, data) => {
  if (wss && wss.clients) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type, data }));
      }
    });
  }
};

module.exports = { initWebSocket, broadcastUpdate };