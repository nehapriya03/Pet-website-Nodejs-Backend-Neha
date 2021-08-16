const express = require("express");
const isLoggedIn = require("../middleware/auth");

const router = express.Router();

const userController = require("../controller/userController");

router.post("/signup", userController.addUser);

router.post("/login", userController.loginUser);

router.get("/user/:id", userController.getUserById);

router.get("/user-target/:targetUserId", userController.getUserByTargetId);

router.put("/user/:id", isLoggedIn, userController.updateUserById);

module.exports = router;
