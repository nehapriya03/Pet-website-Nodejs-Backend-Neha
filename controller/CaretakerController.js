const caretakerRepository = require("../repository/CaretakerRepository");
const Caretaker = require("../models/CaretakerModel");
const { v4: uuidv4 } = require("uuid");

const ERROR_MESSAGE = "An internal server error occured";

exports.addCaretaker = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      about,
      charge,
      chargeDuration,
      location,
      picturePath,
      address,
    } = req.body;

    let caretaker = new Caretaker({
      caretakerId: uuidv4(),
      firstName,
      lastName,
      about,
      charge,
      chargeDuration,
      location,
      picturePath,
      address,
    });
    await caretakerRepository
      .addCaretaker(caretaker)
      .then((caretakerAdded) => {
        console.log(
          `Caretaker with ${caretakerAdded.caretakerId} was sucessfully added.`
        );
        res.status(200).send(caretakerAdded);
      })
      .catch((error) => {
        console.error(`There was an error while adding the caretaker`, error);
        res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    console.log(ERROR_MESSAGE);
    res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getCaretakerById = async (req, res) => {
  try {
    const id = req.params.id;
    await caretakerRepository
      .getCaretakerById(id)
      .then((caretakerFound) => {
        if (caretakerFound == null) {
          console.error(
            `Caretaker with caretakerId: ${caretalerId} doesn't exist`
          );
          res
            .status(404)
            .send(`Caretaker with caretakerId: ${caretalerId} doesn't exist`);
        }
        console.info(
          `Caretaker with caretakerId: ${caretakerFound.caretakerId} was successfully found.`
        );
        return res.status(200).send(caretakerFound);
      })
      .catch((error) => {
        console.log(
          `There was an error finding the caretaker with caretakerId: ${caretakerId}`
        );
        return res
          .status(404)
          .send(
            `There was an error finding the caretaker with caretakerId: ${caretakerId}`
          );
      });
  } catch (error) {
    console.error(ERROR_MESSAGE);
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.updateCaretakerById = async (req, res) => {
  try {
    let caretakerID = req.params.id;
    const {
      caretakerId,
      firstName,
      lastName,
      about,
      charge,
      chargeDuration,
      location,
      picturePath,
      address,
    } = req.body;

    let caretaker = {
      caretakerId,
      firstName,
      lastName,
      about,
      charge,
      chargeDuration,
      location,
      picturePath,
      address,
    };

    if (caretakerID !== caretakerId) {
      console.warn("The ID in the body and path parameter must be the same");
      return res
        .status(400)
        .send("The ID in the body and path parameter must be the same");
    }
    await caretakerRepository
      .getCaretakerById(caretakerId)
      .then(async (caretakerFound) => {
        if (caretakerFound === null) {
          console.error(
            `Update Failed: Caretaker with ${caretakerID} doesn't exists.`
          );
          return res
            .status(404)
            .send(
              `Update Failed: Caretaker with ${caretakerID} doesn't exists.`
            );
        }
        await caretakerRepository
          .updateCaretakerById(caretaker)
          .then((updatedCaretaker) => {
            if (updatedCaretaker.n === 0) {
              console.error(`Caretaker with ${caretakerId} does not exists.`);
              return res
                .status(404)
                .send(`Doctor with doctorId: ${caretakerId} does not exists.`);
            }
            console.log(
              `Caretaker with ${caretakerID} was sucessfully updated`
            );
            return res.status(200).send(updatedCaretaker);
          })
          .catch((error) => {
            console.error(
              `Update Failed: Caretaker with ${caretakerId} was found but was not updated`,
              error
            );
            // return res
            //   .status(500)
            //   .send(
            //     `Update Failed: Caretaker with ${caretakerId} was not updated`
            //   );
          });
      })
      .catch((error) => {
        console.error(
          `There was an error fetching the caretaker with caretakerId:  ${caretakerID}`,
          error
        );
      });
  } catch (error) {
    console.error(ERROR_MESSAGE);
    return res.status(500).send(ERROR_MESSAGE);
  }
};
