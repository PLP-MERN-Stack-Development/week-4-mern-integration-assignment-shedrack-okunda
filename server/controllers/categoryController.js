const { validationResult } = require("express-validator");
const Category = require("../models/Category");

// POST /api/categories
exports.createCategory = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).json({ errors: errors.array() });

	try {
		const category = await Category.create(req.body);
		res.status(201).json(category);
	} catch (error) {
		next(error);
	}
};

// GET /api/categories
exports.getAllCategories = async (req, res, next) => {
	try {
		const categories = await Category.find();
		res.json(categories);
	} catch (error) {
		next(error);
	}
};
