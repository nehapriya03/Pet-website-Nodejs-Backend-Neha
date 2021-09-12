const { v4: uuidv4 } = require("uuid");

const Doctor = require("../models/DoctorModel");
const doctorRepository = require("../repository/DoctorRepository");

const ERROR_MESSAGE = "An internal server error occured.";

exports.addDoctor = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      address,
      location,
      speciality,
      chargeDuration,
      charges,
      about,
      picturePath,
    } = req.body;

    const doctor = new Doctor({
      doctorId: uuidv4(),
      firstName,
      lastName,
      address,
      location,
      speciality,
      chargeDuration,
      charges,
      about,
      picturePath,
    });

    await doctorRepository
      .addDoctor(doctor)
      .then((addedDoctor) => {
        console.info(
          `Doctor with doctorId: ${addedDoctor.doctorId} has been sucessfully added.`
        );
        return res.status(200).send(addedDoctor);
      })
      .catch((error) => {
        console.error(`There was an error while adding the doctor.`, error);
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getDoctorByDoctorId = async (req, res) => {
  try {
    const doctorId = req.params.id;
    await doctorRepository.getDoctorByDoctorId(doctorId).then((doctorFound) => {
      if (doctorFound == null) {
        console.log(
          `Doctor with doctorId: ${doctor.doctorId} does not exists.`
        );
        res
          .status(404)
          .send(`Doctor with doctorId: ${doctor.doctorId} does not exists.`);
      }
      console.log(
        `A doctor with doctorId: ${doctorId} has been sucessfully found.`
      );
      return res.send(200).send(doctorFound);
    });
  } catch (error) {
    console.error(
      `There was an error while fetching the doctor with doctorId: ${doctor.doctorId}`
    );
    res.send(500).send(ERROR_MESSAGE);
  }
};

exports.getAllDoctor = async (req, res) => {
  try {
    await doctorRepository
      .getAllDoctor()
      .then((doctorsFound) => {
        if (doctorsFound.length === 0) {
          console.info("No doctor is present in the database");
          return res.status(404).send("No doctor is present in the database");
        }
        console.info(`All doctors has been fetched sucessfully`);
        return res.status(200).send(doctorsFound);
      })
      .catch((error) => {
        console.error(
          `There has been an error finding the doctors from database.`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.updateDoctorById = async (req, res, next) => {
  try {
    let docId = req.params.id;
    const { doctorId } = req.body;

    if (docId != doctorId) {
      console.warn(
        `The ID in the body must be same as that in the path parameter.`
      );
      return res
        .status(400)
        .send(`The ID in the body must be same as that in the path parameter.`);
    }

    let doctor = {
      firstName,
      lastName,
      address,
      location,
      speciality,
      chargeDuration,
      charges,
      about,
      picturePath,
    };
    await doctorRepository.getDoctorById(docId).then(async (doctorFound) => {
      if (doctorFound === null) {
        return res
          .status(404)
          .send(`Doctor with doctorId: ${doctorId} was not found.`);
      }
      await doctorRepository.updateDoctorById(doctor).then((updatedDoctor) => {
        if (updatedDoctor.n === 0) {
          console.error(`Doctor with doctorId: ${docId} does not exists.`);
          return res
            .status(404)
            .send(`Doctor with doctorId: ${docId} does not exists.`);
        }
        console.log(`Doctor with ${docId} was sucessfully updated`);
        return res.status(200).send(updatedDoctor);
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.deleteDoctorById = async (req, res, next) => {
  try {
    let docId = req.params.id;

    await doctorRepository
      .getDoctorById(docId)
      .then(async (doctorFound) => {
        if (doctorFound === null) {
          console.error(`Doctor with doctorId: ${docId} does not exists.`);
          return res
            .send(404)
            .send(`Doctor with doctorId: ${docId} does not exists.`);
        }
        await doctorRepository
          .deleteDoctorById(docId)
          .then((updatedDoctor) => {
            if (updatedDoctor.deleteCount > 0) {
              console.error(`Doctor with ${docId} was successfully deleted.`);
              res.status(200).send(doctorFound);
            }
          })
          .catch((error) => {
            console.error(
              `Delete failed: Doctor with ${docId} was not deleted. `,
              error
            );
            return res.status(500).send(ERROR_MESSAGE);
          });
      })
      .catch((error) => {
        console.error(
          `Delete Failed: Doctor with doctorId: ${doctorId} doesn't exist.`,
          error
        );
      });
  } catch (error) {
    console.error(`Doctor with ${docId} was found but not deleted`, error);
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getDoctorsByAvgReview = async (req, res, next) => {
  try {
    let { locationArray, doctorId } = req.body;
    await doctorRepository
      .getDoctorByAvgReview(locationArray, doctorId)
      .then((doctorsWithAvgReview) => {
        if (doctorsWithAvgReview.length === 0) {
          console.error(
            `No Doctors were found with review info for location ${locationArray.toString()}`
          );
          return res
            .status(404)
            .send(
              `No Doctors were found with review info for location ${locationArray.toString()}.`
            );
        }
        console.info(
          `Doctors with their review data of location: ${locationArray.toString()} were successfully found.`
        );
        return res.status(200).send(doctorsWithAvgReview);
      })
      .catch((error) => {
        console.error(error);
        return res
          .status(500)
          .send(
            `There was some error while fetching the doctors of location: ${locationArray.toString()} with their review data.`
          );
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send(ERROR_MESSAGE);
  }
};
