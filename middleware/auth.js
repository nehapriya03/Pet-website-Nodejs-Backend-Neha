const jwt = require("jsonwebtoken");
const envData = process.env;

const auth = (req, res, next) => {
  try {
  } catch (e) {
    res.status(400).send(e);
  }
};
