const express = require("express");
const isLoggedIn = require("../middleware/auth");

const router = express.Router();
const caretakerController = require("../controller/CaretakerController");

router.post("/", caretakerController.addCaretaker);
router.get("/:id", caretakerController.getCaretakerById);
router.put("/:id", caretakerController.updateCaretakerById);
module.exports = router;
