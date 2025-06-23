const express = require("express");
const {
	getAllCategories,
	createCategory,
} = require("../controllers/categoryController");
const { validateCategory } = require("../middleware/validate");
const router = express.Router();

router.post("/", validateCategory, createCategory);
router.get("/", getAllCategories);

module.exports = router;
