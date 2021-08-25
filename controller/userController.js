const userRepository = require("../repository/userRepository");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const envData = process.env;

const ERROR_MESSAGE = "An internal server error occured";

exports.addUser = async (req, res) => {
  let {
    name,
    email,
    password,
    phoneNumber,
    targetUserId,
    profileType,
    gender,
    picturePath,
  } = req.body;

  await userRepository
    .getUserByEmail(email)
    .then(async (result) => {
      if (result !== null) {
        console.error(`A user with email: ${email} already exists`);
        return res
          .status(409)
          .send(`A user with email: ${email} already exists`);
      }

      await userRepository
        .getUserByPhoneNumber(phoneNumber)
        .then((result) => {
          if (result !== null) {
            console.error(
              `A user with phone number: ${phoneNumber} already exists.`
            );
            return res
              .status(409)
              .send(`A user with phone number: ${phoneNumber} already exists`);
          }

          bcrypt.hash(password, 12, async (error, hash) => {
            if (error) {
              console.log(
                `There was an error while encrypting the password.`,
                error
              );
            }
            password = hash;

            const user = new User({
              name,
              email,
              phoneNumber,
              password: hash,
              targetUserId,
              profileType,
              gender,
              picturePath,
            });

            await userRepository
              .addUser(user)
              .then((addedUser) => {
                const token = jwt.sign(
                  {
                    email: addedUser.email,
                    userId: addedUser.userId,
                    targetUserId: addedUser.targetUserId,
                    phoneNumber: addedUser.phoneNumber,
                  },
                  envData.JWT_SECRETKEY,
                  {
                    expiresIn: "1h",
                  }
                );

                console.info(
                  `A new user with email: ${addedUser.email} was sucessfully added `
                );

                return res.status(200).json({ user: addedUser, token });
              })
              .catch((error) => {
                console.error("An error occured while adding the user", error);
                return res
                  .status(400)
                  .send("An error occured while adding the user", error);
              });
          });
        })
        .catch((error) => {
          console.log(
            `There was an error fetching the user with phone number: ${user.phoneNumber}`,
            error
          );
        });
    })
    .catch((error) => {
      console.error(
        `There was an error while fetching the user with email: ${user.email}.`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  await userRepository.getUserByEmail(email).then((user) => {
    if (user === null) {
      console.error(`User with email: ${email} does not exists`);
      return res.status(400).send(`User with email: ${email} does not exists`);
    }

    bcrypt
      .compare(password, user.password)
      .then((matches) => {
        if (matches) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user.userId,
            },
            envData.JWT_SECRETKEY,
            {
              expiresIn: "1h",
            }
          );
          console.info("Login sucessfull");
          return res.status(200).json({ user, token });
        } else {
          console.warn("Incorrect credentials");
          console.log(email);
          console.log(req.body.password);
          return res.status(400).send("Incorrect credentials");
        }
      })
      .catch((error) => {
        console.error(
          `There was an error while retrieving the user with email: ${email}`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  });
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  await userRepository
    .getUserById(id)
    .then((results) => {
      console.log(results);
      if (results == null) {
        console.error(`No user found with userId: ${id}`);
        return res.status(400).send(`User with userId: ${id} does not exists`);
      } else {
        console.info(`User with userId: ${id} was sucessfully found`);

        // res.send(results);
        return res.status(200).json(results);
        // .send(`User with userId: ${id} was sucessfully found`);
      }
    })
    .catch((error) => {
      console.error(
        `There was an error in fetching the user with userId: ${id},`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getUserByTargetId = async (req, res) => {
  const { targetUserId } = req.params;
  await userRepository
    .getUserByTargetUserId(targetUserId)
    .then((results) => {
      if (results == null) {
        console.error(
          `User with targetUserId: ${targetUserId} does not exists`
        );
        return res
          .status(404)
          .send(`User with targetUserId: ${targetUserId} does not exists`);
      }
      console.log(
        `User with targetUserId: ${targetUserId} was sucesfully found`
      );
      return res
        .status(200)
        .send(`User with targetUserId: ${targetUserId} was sucessfully found`);
    })
    .catch((error) => {
      console.error(
        `There was an error in finding the user with targetUserId: ${targetUserId}`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.updateUserById = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body);
  const {
    userId,
    name,
    email,
    password,
    phoneNumber,
    targetUserId,
    profileType,
    gender,
    picturePath,
  } = req.body.user;

  if (id !== userId) {
    console.error("Id in the body and path must be same");
    return res.status(400).send("The ID in the body and the path must be same");
  }

  let user = {
    userId,
    email,
    name,
    phoneNumber,
    profileType,
    gender,
    targetUserId,
    picturePath,
  };

  await userRepository.getUserById(id).then(async (foundUser) => {
    if (foundUser == null) {
      console.error(`Update failed: user with userId: ${id} does not exists`);
      return res
        .status(404)
        .send(`Update failed: user with userId: ${id} does not exists`);
    }

    await userRepository
      .updateUserById(user)
      .then((results) => {
        if (results.n === 0) {
          console.error(
            `Update Failed: User with userId: ${id} does not exists`
          );
          return res
            .status(400)
            .send(`Update Failed: User with userId: ${id} does not exists`);
        }
        console.log(
          `Update sucessfull: User with userId: ${id} was updated sucessfully `
        );
        // res.json(results);
        return res.status(200).json(user);
        // .send(
        //   `Update sucessfull: User with userId: ${id} was updated sucessfully `
        // );
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send(ERROR_MESSAGE);
      });
  });
};
