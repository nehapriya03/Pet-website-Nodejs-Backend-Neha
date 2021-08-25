const { v4: uuidv4 } = require("uuid");
const Pet = require("../models/PetModel");
const petRepository = require("../repository/PetRepository");

const ERROR_MESSAGE = "An Internal server error occured";

const envData = process.env;

exports.addPet = async (req, res) => {
  try {
    let {
      name,
      animalType,
      breed,
      medicalHistory,
      location,
      age,
      mateStatus,
      gender,
      picturePath,
      ownerId,
    } = req.body;

    let pet = new Pet({
      petId: uuidv4(),
      name,
      animalType,
      breed,
      ownerId,
      location,
      medicalHistory,
      mateStatus,
      picturePath,
      gender,
      age,
    });

    await petRepository
      .addPet(pet)
      .then((result) => {
        console.info(
          `Pet with petId: ${result.petId} was successfully added to the database.`
        );
        return res.status(200).send(result);
      })
      .catch((error) => {
        console.error(
          "There was an error while adding a new pet to the database.",
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    console.log("Pet has not been added");
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getPetByOwnerId = async (req, res) => {
  try {
    let ownerId = req.params.ownerId;
    await petRepository
      .getPetsByOwnerId(ownerId)
      .then((petsOfOwner) => {
        if (petsOfOwner.length === 0) {
          console.error(`No pets were found with ownerId: ${ownerId}`);
          return res
            .status(404)
            .send(`Pets with owner ID: ${ownerId} doesn't exists!`);
        }
        console.info(`Pets with owner ID: ${ownerId} were sucessfully found`);
        return res.status(200).send(petsOfOwner);
      })
      .catch((error) => {
        console.error(
          `There was an error while fetching pets with ownerId: ${ownerId}`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};
