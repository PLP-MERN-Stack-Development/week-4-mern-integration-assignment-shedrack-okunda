const express = require("express");
const {
	getAllPosts,
	getPostById,
	createPost,
	updatePost,
	deletePost,
} = require("../controllers/postController");
const { validatePost } = require("../middleware/validate");
const router = express.Router();

router.post("/", validatePost, createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", validatePost, updatePost);
router.delete("/:id", deletePost);

module.exports = router;
