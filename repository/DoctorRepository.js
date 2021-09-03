const mongoose = require("mongoose");
const Doctor = require("../models/DoctorModel");

exports.addDoctor = async (doctor) => {
  try {
    return await doctor.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getAllDoctor = async () => {
  try {
    return await Doctor.find({});
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getDoctorById = async (doctorId) => {
  try {
    return await Doctor.findOne({ doctorId: doctorId });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.updateDoctorById = async (doctor) => {
  try {
    return await Doctor.findOneAndUpdate(
      { doctorId: doctor.doctorId },
      { $set: { ...doctor } }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteDoctorById = async (doctorId) => {
  try {
    return Doctor.deleteOne({ doctorId: doctorId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
