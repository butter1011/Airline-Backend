const PORT = process.env.PORT || 3000;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const { initWebSocket } = require("./utils/websocket.js");
const connectDB = require("./utils/connectDB.js");

const getApi = require("./routes/getRoutes.js");
const postApi = require("./routes/postRoutes.js");

// Connect to MongoDB
connectDB();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use(postApi);
app.use(getApi);

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
initWebSocket(server);
