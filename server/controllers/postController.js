const Post = require("../models/Post");
const { validationResult } = require("express-validator");

// POST /api/posts
exports.createPost = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).json({ errors: errors.array() });

	try {
		const post = await Post.create(req.body);
		res.status(201).json(post);
	} catch (error) {
		next(error);
	}
};

// GET /api/posts
exports.getAllPosts = async (req, res, next) => {
	try {
		const posts = await Post.find().populate("author category", "name");
		res.json(posts);
	} catch (error) {
		next(error);
	}
};

// GET /api/posts/:id
exports.getPostById = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id).populate(
			"author category",
			"name"
		);
		if (!post) return res.status(404).json({ message: "Post not found" });
		res.json(post);
	} catch (error) {
		next(error);
	}
};

// PUT /api/posts/:id
exports.updatePost = async (req, res, next) => {
	try {
		const updatedPost = await Post.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!updatedPost)
			return res.status(404).json({ message: "Post not found" });
		res.json(updatedPost);
	} catch (error) {
		next(error);
	}
};

// DELETE /api/posts/:ids
exports.deletePost = async (req, res, next) => {
	try {
		const deletedPost = await Post.findByIdAndDelete(req.params.id);
		if (!deletedPost)
			return res.status(404).json({ message: "Post not found" });
		res.json({ message: "Post deleted successfully" });
	} catch (error) {
		next(error);
	}
};
