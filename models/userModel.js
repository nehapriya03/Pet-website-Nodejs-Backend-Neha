const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const validator = require("validator");

const user = mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    default: uuidv4(),
  },

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 7,
    validate(value) {
      if (value.length < 7) {
        throw new Error("Password length should be greater than 7 character");
      }
    },
  },

  phoneNumber: {
    type: Number,
    required: true,
    minlength: 10,
    validate(value) {
      if (value.length < 10) {
        throw new Error("Phone Number should be 10 digit");
      }
    },
  },

  targetUserId: {
    type: String,
    default: "",
  },

  profileType: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  picturePath: {
    type: String,
  },
});

module.exports = mongoose.model("user", user);
