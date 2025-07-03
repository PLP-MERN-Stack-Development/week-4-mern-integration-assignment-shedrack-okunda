// src/components/PostForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePost } from "../hooks/useApi";
import { useApp } from "../services/ContextApi";

const PostForm = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const isEditing = Boolean(id);

	const { categories, createPost, updatePost, loading, error } = useApp();
	const { post, loading: postLoading } = usePost(id);

	const [formData, setFormData] = useState({
		title: "",
		content: "",
		category: "",
		tags: "",
		status: "draft",
	});

	const [validationErrors, setValidationErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Populate form when editing
	useEffect(() => {
		if (isEditing && post) {
			setFormData({
				title: post.title || "",
				content: post.content || "",
				category: post.category?._id || "",
				tags: post.tags?.join(", ") || "",
				status: post.status || "draft",
			});
		}
	}, [isEditing, post]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear validation error when user starts typing
		if (validationErrors[name]) {
			setValidationErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const errors = {};

		if (!formData.title.trim()) {
			errors.title = "Title is required";
		}

		if (!formData.content.trim()) {
			errors.content = "Content is required";
		}

		if (!formData.category) {
			errors.category = "Please select a category";
		}

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			const postData = {
				...formData,
				tags: formData.tags
					.split(",")
					.map((tag) => tag.trim())
					.filter((tag) => tag),
			};

			if (isEditing) {
				await updatePost(id, postData);
			} else {
				await createPost(postData);
			}

			navigate("/");
		} catch (error) {
			console.error("Error saving post:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		navigate("/");
	};

	if (isEditing && postLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="bg-white rounded-lg shadow-md p-6">
				<h1 className="text-2xl font-bold mb-6">
					{isEditing ? "Edit Post" : "Create New Post"}
				</h1>

				{error && (
					<div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Title */}
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700 mb-2">
							Title *
						</label>
						<input
							type="text"
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								validationErrors.title
									? "border-red-500"
									: "border-gray-300"
							}`}
							placeholder="Enter post title"
						/>
						{validationErrors.title && (
							<p className="mt-1 text-sm text-red-600">
								{validationErrors.title}
							</p>
						)}
					</div>

					{/* Content */}
					<div>
						<label
							htmlFor="content"
							className="block text-sm font-medium text-gray-700 mb-2">
							Content *
						</label>
						<textarea
							id="content"
							name="content"
							value={formData.content}
							onChange={handleChange}
							rows="12"
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								validationErrors.content
									? "border-red-500"
									: "border-gray-300"
							}`}
							placeholder="Write your post content here..."
						/>
						{validationErrors.content && (
							<p className="mt-1 text-sm text-red-600">
								{validationErrors.content}
							</p>
						)}
					</div>

					{/* Category */}
					<div>
						<label
							htmlFor="category"
							className="block text-sm font-medium text-gray-700 mb-2">
							Category *
						</label>
						<select
							id="category"
							name="category"
							value={formData.category}
							onChange={handleChange}
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								validationErrors.category
									? "border-red-500"
									: "border-gray-300"
							}`}>
							<option value="">Select a category</option>
							{categories.map((category) => (
								<option key={category._id} value={category._id}>
									{category.name}
								</option>
							))}
						</select>
						{validationErrors.category && (
							<p className="mt-1 text-sm text-red-600">
								{validationErrors.category}
							</p>
						)}
					</div>

					{/* Tags */}
					<div>
						<label
							htmlFor="tags"
							className="block text-sm font-medium text-gray-700 mb-2">
							Tags
						</label>
						<input
							type="text"
							id="tags"
							name="tags"
							value={formData.tags}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter tags separated by commas"
						/>
						<p className="mt-1 text-sm text-gray-500">
							Separate multiple tags with commas
						</p>
					</div>

					{/* Status */}
					<div>
						<label
							htmlFor="status"
							className="block text-sm font-medium text-gray-700 mb-2">
							Status
						</label>
						<select
							id="status"
							name="status"
							value={formData.status}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
							<option value="draft">Draft</option>
							<option value="published">Published</option>
						</select>
					</div>

					{/* Submit buttons */}
					<div className="flex justify-end space-x-4">
						<button
							type="button"
							onClick={handleCancel}
							disabled={isSubmitting}
							className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50">
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting || loading}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center">
							{isSubmitting && (
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
							)}
							{isEditing ? "Update Post" : "Create Post"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PostForm;
