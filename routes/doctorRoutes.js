const express = require("express");
const isLoggedIn = require("../middleware/auth");

const router = express.Router();
const doctorController = require("../controller/DoctorController");

router.post("/", doctorController.addDoctor);
router.get("/:id", doctorController.getDoctorByDoctorId);
router.get("/get/all", doctorController.getAllDoctor);
router.put("/:id", doctorController.updateDoctorById);
router.delete("/:id", isLoggedIn, doctorController.getDoctorByDoctorId);

module.exports = router;
