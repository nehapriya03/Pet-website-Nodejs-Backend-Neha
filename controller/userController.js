const userRepository = require("../repository/userRepository");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const envData = process.env;

const ERROR_MESSAGE = "An internal server error occured";

exports.addUser = async (req, res) => {
  const user = new User(req.body);

  await userRepository
    .getUserByEmail(user.email)
    .then(async (results) => {
      if (results != null) {
        console.error(`User with email: ${email} already  exists.`);
        return res.status(401).send(`User with email: ${email} already exists`);
      }

      await userRepository
        .getUserByPhoneNumber(user.phoneNumber)
        .then((results) => {
          if (results != null) {
            console.error(
              `User with phone number: ${phoneNumber} already exists.`
            );
            results
              .status(401)
              .send(`User with phone number: ${phoneNumber} already exists`);
          }
        })
        .catch((error) => {
          console.error(
            `There was an error fetching the user with phone number: ${phoneNumber}`,
            error
          );
        });

      bcrypt.hash(user.password, 12, async (err, hash) => {
        if (err) {
          console.error("There was an error while encrypting the password");
        }
        return res.status(500).send(ERROR_MESSAGE);
      });

      await userRepository
        .addUser(user)
        .then((addedUser) => {
          const token = jwt.sign(
            {
              email: addedUser.email,
              userId: addedUser.userId,
              userType: addedUser.userType,
            },
            envData.JWT_SECRETKEY,
            {
              expiresIn: "1h",
            }
          );
          console.info(
            `A new user with email: ${addedUser.email} was sucessfully added`
          );
          res.status(400).json({ user: addedUser, token });
        })
        .catch((error) => {
          console.error("An error occured while adding the user", error);
          res.status(400).send("An error occured while adding the user", error);
        });
    })
    .catch((error) => {
      console.error(
        `There was an error fetching the user with ${email}`,
        error
      );
      res.status(500).send(ERROR_MESSAGE);
    });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  await userRepository.getUserByEmail(email).then((results) => {
    if (results === null) {
      console.error(`User with email: ${email} does not exists`);
      res.status(400).send(`User with email: ${email} does not exists`);
    }

    bcrypt
      .compare(password, results.password)
      .then((matches) => {
        if (matches) {
          const token = jwt.sign(
            {
              email: results.email,
              userId: results.userId,
              userType: results.userType,
            },
            envData.JWT_SECRETKEY,
            {
              expiresIn: "1h",
            }
          );
          console.info("Login sucessfull");
          return res.status(200).json({ user, token });
        }
        console.warn("Incorrect credentials");
        return res.status(400).send("Incorrect credentials");
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
  const id = req.params;
  await userRepository.getUserById(id).then((results) => {
    if (results == null) {
      console.error(`No user found with userId: ${id}`);
      return res.status(400).send(`User with userId: ${id} does not exists`);
    }
    console.info(`User with userId: ${id} was sucessfully found`);
    return res
      .status(200)
      .send(`User with userId: ${id} was sucessfully found`)
      .catch((error) => {
        console.error(
          `There was an error in fetching the user with userId: ${id}`
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
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

exports.updateUserById = async (req, res) => {
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
