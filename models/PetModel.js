const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Pet = mongoose.Schema({
  petId: {
    type: String,
    default: uuidv4(),
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  animalType: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  medicalHostory: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  mateStatus: {
    type: String,
    required: true,
    default: false,
  },
  gender: {
    type: String,
    required: true,
  },
  picturePath: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Pet", Pet, "Pet");
