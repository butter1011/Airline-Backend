const express = require("express");
const app = express();
const connectDB = require("./utils/connectDB.js");
const airlineRouter = require("./routes/routes.js");
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
// Connect to MongoDB
connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(airlineRouter);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
