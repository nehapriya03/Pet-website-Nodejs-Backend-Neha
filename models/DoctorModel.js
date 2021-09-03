const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Doctor = mongoose.Schema({
  doctorId: {
    type: String,
    unique: true,
    default: uuidv4(),
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  chargeDuration: {
    type: String,
    required: true,
  },
  charges: {
    type: Number,
    required: true,
  },

  about: {
    type: String,
    required: true,
  },
  picturePath: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("doctor", Doctor, "doctor");
