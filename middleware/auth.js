const jwt = require("jsonwebtoken");
const envData = process.env;

const isLoggedInUser = async (req, res, next) => {
  try {
    if (!req.header.Authorization) {
      console.error("No authorization token found");
      return res
        .status(403)
        .send("No authrorization token was found for verification.");
    }

    const token = req.header.Authorization.replace("Bearer ", "");
    const decode = jwt.verify(token, envData.JWT_SECRETKEY);
    console.info("Token was sucessfuly verified.");
    req.userData = decoded;
    next();
  } catch (error) {
    console.error("There was some error in verifying the token");
    return res.status(500).send(error);
  }
};

module.exports = isLoggedInUser;
