const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const envData = process.env;
app.use(cors());

const userRoutes = require("./routes/userRoutes");
const petRoutes = require("./routes/petRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const caretakerRoutes = require("./routes/caretakerRoutes");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));
app.use(userRoutes);
app.use("/pet", petRoutes);
app.use("/doctor", doctorRoutes);
app.use("/caretaker", caretakerRoutes);

mongoose
  .connect(envData.DB, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log(envData.DB);
    console.log("Mongo DB connected sucessfully ");
  })
  .catch((e) => {
    console.log("Error connecting to database");
  });

var project = "Philozooic";
var port = 7000;
app.listen(port, () => {
  console.log(`${project} is running at port ${port}`);
});
