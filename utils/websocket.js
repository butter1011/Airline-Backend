const WebSocket = require("ws");
let wssInstance;
const setWebSocketInstance = (instance) => {
  wssInstance = instance;
};

const getWebSocketInstance = () => {
  return wssInstance;
};

const initWebSocket = (server) => {
  wss = new WebSocket.Server({ server });
  setWebSocketInstance(wss);

  wss.on("connection", (ws) => {
    // console.log("Client connected");

    ws.on("close", () => {
      // console.log("Client disconnected");
    });
  });
};

module.exports = {
  initWebSocket,
  getWebSocketInstance,
  setWebSocketInstance,
  initWebSocket,
};
