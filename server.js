const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const WebSocketServer = require("ws");
const wss = new WebSocketServer({ port: 8080 });

const { initWebSocket } = require("./utils/websocket.js");
const connectDB = require("./utils/connectDB.js");

const getApi = require("./routes/getRoutes.js");
const postApi = require("./routes/postRoutes.js");

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use(postApi);
app.use(getApi);

// Initialize WebSocket
initWebSocket(wss);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

E8LAFie1sGKdHMG5;
