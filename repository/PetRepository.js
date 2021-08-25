const Pet = require("../models/PetModel");
const mongoose = require("mongoose");

exports.addPet = async (pet) => {
  try {
    return await pet.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getPetsByOwnerId = async (ownerId) => {
  try {
    return await Pet.find({ ownerId: ownerId });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
