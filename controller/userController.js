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

  await userRepository.getUserByEmail(email).then((result) => {
    if (result !== null) {
      console.error(`A user with email: ${email} already exists`);
      return res.status(409).send(`A user with email: ${email} already exists`);
    }

    userRepository
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
                },
                envData.JWT_SECRETKEY,
                {
                  expiresIn: "1h",
                }
              );

              console.info(
                `A new user with email: ${addedUser.email} was sucessfully added `
              );
              return res
                .status(200)
                .send(
                  `A new user with email: ${addedUser.email} was sucessfully added `
                );
            })
            .catch((error) => {
              console.error("An error occured while adding the user", error);
              return res
                .status(400)
                .send("An error occured while adding the user", error);
            })

            .catch((error) => {
              console.error(
                `There was an error while fetching the user with email: ${user.email}.`,
                error
              );
              return res.status(500).send(ERROR_MESSAGE);
            });
        });
      })
      .catch((error) => {
        console.log(
          `There was an error fetching the user with phone number: ${user.phoneNumber}`,
          error
        );
      });
  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  await userRepository.getUserByEmail(email).then((user) => {
    if (user === null) {
      console.error(`User with email: ${email} does not exists`);
      return res.status(400).send(`User with email: ${email} does not exists`);
    }
    console.log(user);

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
        return res
          .status(200)
          .send(`User with userId: ${id} was sucessfully found`);
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
  const id = req.params;
  await userRepository
    .getUserByTargetUserId(id)
    .then((results) => {
      if (results == null) {
        console.error(`User with targetUserId: ${id} does not exists`);
        return res
          .status(404)
          .send(`User with targetUserId: ${id} does not exists`);
      }
      console.log(`User with targetUserId: ${id} was sucesfully found`);
      return res
        .status(200)
        .send(`User with targetUserId: ${id} was sucessfully found`);
    })
    .catch((error) => {
      console.error(
        `There was an error in finding the user with targetUserId: ${id}`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.updateUserById = async (req, res, next) => {
  const user = new User(req.body);
  await userRepository
    .updateUserById(user)
    .then((results) => {
      if (results.n === 0) {
        console.error(
          `Update Failed: User with userId: ${userId} does not exists`
        );
        return res
          .status(400)
          .send(`Update Failed: User with userId: ${userId} does not exists`);
      }
      console.log(
        `Update sucessfull: User with userId: ${userId} was updated sucessfully `
      );
      return res
        .status(200)
        .send(
          `Update sucessfull: User with userId: ${userId} was updated sucessfully `,
          results
        );
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};
