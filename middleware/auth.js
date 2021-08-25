const jwt = require("jsonwebtoken");
const envData = process.env;

const isLoggedInUser = async (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      console.error("No authorization token found");
      return res
        .status(403)
        .send("No authrorization token was found for verification.");
    }
    let token = req.headers["authorization"].replace("Bearer ", "");
    const decode = jwt.verify(token, envData.JWT_SECRETKEY);
    console.info("Token was sucessfuly verified.");
    req.userData = decode;
    next();
  } catch (error) {
    console.error("There was some error in verifying the token", error);
    return res.status(500).send(error);
  }
};

module.exports = isLoggedInUser;
