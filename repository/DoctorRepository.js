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

exports.getDoctorByAvgReview = async (locationArray, doctorId) => {
  try {
    let matchQuery = {};
    if (locationArray.length !== 0) {
      matchQuery = {
        locationArray: { $in: location },
      };
    }
    if (typeof doctorId !== "undefined") {
      matchQuery = {
        ...matchQuery,
        doctorId,
      };
    }

    return await Doctor.aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "review",
          localField: "doctorId",
          foreignField: "reviewOfId",
          as: "reviewData",
        },
      },
      {
        $addFields: {
          reviewAvg: {
            $avg: "$reviewData.rating",
          },
          reviewCount: {
            $size: "$reviewData",
          },
        },
      },
      {
        $sort: {
          reviewAvg: -1,
          reviewCount: -1,
        },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
