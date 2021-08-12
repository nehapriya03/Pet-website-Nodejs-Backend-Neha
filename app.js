const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const envData = process.env;
app.use(cors);

mongoose
  .connect(envData.DB, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("Mongo DB connected sucessfully ");
  })
  .catch((e) => {
    console.log("Error connecting to database");
  });

var project = "Philozooic";
var port = 8000;
app.listen(port, () => {
  console.log(`${project} is running at port ${port}`);
});
