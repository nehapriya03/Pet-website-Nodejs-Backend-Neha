const express = require("express");
const isLoggedIn = require("../middleware/auth");

const router = express.Router();

const petController = require("../controller/PetController");

router.post("/my-pets", petController.addPet);
router.get("/by_owner/:ownerId", petController.getPetByOwnerId);

module.exports = router;
