const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
const connectDB = require("./utils/connectDB.js");
const postApi = require("./routes/postRoutes.js");
const getApi = require("./routes/getRoutes.js");

const PORT = process.env.PORT || 3000;
// Connect to MongoDB
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use(postApi);
app.use(getApi);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
