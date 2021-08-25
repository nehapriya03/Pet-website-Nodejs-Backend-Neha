const mongoose = require("mongoose");
const Caretaker = require("../models/CaretakerModel");

exports.addCaretaker = async (caretaker) => {
  try {
    return await caretaker.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getCaretakerById = async (id) => {
  try {
    return await Caretaker.findOne({ caretakerId: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateCaretakerById = async (caretaker) => {
  try {
    return await Caretaker.updateOne(
      { caretakerId: caretaker.caretakerId },
      { $set: { caretaker } }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteCaretakerById = async (id) => {
  try {
    return await Caretaker.deleteOne({ caretakerId: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getPetByOwnerId = async (ownerId) => {
  try {
    return await Caretaker.findOne({ ownerId: ownerId });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
