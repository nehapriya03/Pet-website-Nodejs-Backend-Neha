const user = require("../models/userModel");

exports.addUser = async (user) => {
  return await user.save();
};

exports.getUserByEmail = async (email) => {
  try {
    return await user.findOne({ email });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getUserByPhoneNumber = async (phoneNumber) => {
  try {
    return await user.findOne({ phoneNumber });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getUserById = async (id) => {
  try {
    return await user.findOne({ userId: id });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getUserByTargetUserId = async (id) => {
  try {
    return await user.findOne({ targetUserId: id });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.updateUserById = async (user) => {
  try {
    let { name, phoneNumber } = user;
    return await user.findAndUpdate(
      { userId: user.userId },
      { $set: { name, phoneNumber } }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};
