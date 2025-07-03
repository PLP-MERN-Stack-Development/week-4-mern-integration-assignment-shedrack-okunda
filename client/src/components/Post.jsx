import { useState } from "react";
import { createContext } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useApi } from "../hooks/Api";
import {
	ArrowLeft,
	Calendar,
	Edit,
	Plus,
	Save,
	Tag,
	Trash2,
	X,
} from "lucide-react";

const AppContext = createContext();

// Context Provider
export const AppProvider = ({ children }) => {
	const [posts, setPosts] = useState([]);
	const [categories, setCategories] = useState([]);
	const { apiCall } = useApi();

	const fetchPosts = async () => {
		try {
			const data = await apiCall("/posts");
			setPosts(data);
		} catch (err) {
			console.error("Error fetching posts:");
			throw err;
		}
	};

	const fetchCategories = async () => {
		try {
			const data = await apiCall("/categories");
			setCategories(data);
		} catch (err) {
			console.error("Error fetching categories:");
			throw err;
		}
	};

	const createPost = async (postData) => {
		try {
			console.log(postData);
			const newPost = await apiCall("/posts", {
				method: "POST",
				body: JSON.stringify(postData),
			});
			setPosts((prev) => [newPost, ...prev]);
			return newPost;
		} catch (err) {
			console.error("Error creating post:");
			throw err;
		}
	};

	const updatePost = async (id, postData) => {
		try {
			const updatedPost = await apiCall(`/posts/${id}`, {
				method: "PUT",
				body: JSON.stringify(postData),
			});
			setPosts((prev) =>
				prev.map((post) => (post._id === id ? updatedPost : post))
			);
			return updatedPost;
		} catch (err) {
			console.error("Error updating post:");
			throw err;
		}
	};

	const deletePost = async (id) => {
		try {
			await apiCall(`/posts/${id}`, { method: "DELETE" });
			setPosts((prev) => prev.filter((post) => post._id !== id));
		} catch (err) {
			console.error("Error deleting post:");
			throw err;
		}
	};

	const createCategory = async (categoryData) => {
		try {
			const newCategory = await apiCall("/categories", {
				method: "POST",
				body: JSON.stringify(categoryData),
			});
			setCategories((prev) => [...prev, newCategory]);
			return newCategory;
		} catch (err) {
			console.error("Error creating category:");
			throw err;
		}
	};

	useEffect(() => {
		fetchPosts();
		fetchCategories();
	}, []);

	return (
		<AppContext.Provider
			value={{
				posts,
				categories,
				createPost,
				updatePost,
				deletePost,
				createCategory,
				fetchPosts,
				fetchCategories,
			}}>
			{children}
		</AppContext.Provider>
	);
};

// Post List Component
export const PostList = () => {
	const { posts, categories, deletePost } = useContext(AppContext);
	const [selectedCategory, setSelectedCategory] = useState("");
	const navigate = useNavigate();

	const filteredPosts = selectedCategory
		? posts.filter((post) => post.category?._id === selectedCategory)
		: posts;

	const handleDeletePost = async (id) => {
		if (window.confirm("Are you sure you want to delete this post?")) {
			try {
				await deletePost(id);
			} catch (err) {
				alert("Error deleting post", err);
			}
		}
	};

	const getCategoryName = (categoryId) => {
		const category = categories.find((cat) => cat._id === categoryId);
		return category?.name || "Uncategorized";
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
				<div className="flex items-center space-x-4">
					<select
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
						<option value="">All Categories</option>
						{categories.map((category) => (
							<option key={category._id} value={category._id}>
								{category.name}
							</option>
						))}
					</select>
				</div>
			</div>

			{filteredPosts.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-gray-500 text-lg">No posts found.</p>
					<Link
						to="/create"
						className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
						<Plus className="w-5 h-5 mr-2" />
						Create your first post
					</Link>
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{filteredPosts.map((post) => (
						<div
							key={post._id}
							className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
							<div className="p-6">
								<div className="flex items-center justify-between mb-2">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
										<Tag className="w-3 h-3 mr-1" />
										{getCategoryName(post.category)}
									</span>
									<div className="flex space-x-2">
										<button
											onClick={() =>
												navigate(`/edit/${post._id}`)
											}
											className="text-gray-400 hover:text-blue-600">
											<Edit className="w-4 h-4" />
										</button>
										<button
											onClick={() =>
												handleDeletePost(post._id)
											}
											className="text-gray-400 hover:text-red-600">
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
									<Link to={`/post/${post._id}`}>
										{post.title}
									</Link>
								</h3>
								<p className="text-gray-600 text-sm mb-4 line-clamp-3">
									{post.content.substring(0, 150)}...
								</p>
								<div className="flex items-center text-sm text-gray-500">
									<Calendar className="w-4 h-4 mr-1" />
									{new Date(
										post.createdAt
									).toLocaleDateString()}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

// Single Post View Component
export const SinglePostView = () => {
	const { id } = useParams();
	const { posts, categories } = useContext(AppContext);
	const [post, setPost] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const foundPost = posts.find((p) => p._id === id);
		setPost(foundPost);
	}, [id, posts]);

	if (!post) {
		return (
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="text-center">
					<p className="text-gray-500">Post not found</p>
					<Link
						to="/"
						className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
						← Back to posts
					</Link>
				</div>
			</div>
		);
	}

	const getCategoryName = (categoryId) => {
		const category = categories.find((cat) => cat._id === categoryId);
		return category?.name || "Uncategorized";
	};

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<button
				onClick={() => navigate("/")}
				className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
				<ArrowLeft className="w-4 h-4 mr-2" />
				Back to posts
			</button>

			<article className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="px-8 py-6">
					<div className="flex items-center justify-between mb-4">
						<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
							<Tag className="w-4 h-4 mr-2" />
							{getCategoryName(post.category)}
						</span>
						<div className="flex items-center space-x-4">
							<button
								onClick={() => navigate(`/edit/${post._id}`)}
								className="flex items-center text-blue-600 hover:text-blue-800">
								<Edit className="w-4 h-4 mr-1" />
								Edit
							</button>
						</div>
					</div>

					<h1 className="text-3xl font-bold text-gray-900 mb-4">
						{post.title}
					</h1>

					<div className="flex items-center text-gray-500 mb-6">
						<Calendar className="w-4 h-4 mr-2" />
						{new Date(post.createdAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</div>

					<div className="prose max-w-none">
						{post.content.split("\n").map((paragraph, index) => (
							<p
								key={index}
								className="mb-4 text-gray-700 leading-relaxed">
								{paragraph}
							</p>
						))}
					</div>
				</div>
			</article>
		</div>
	);
};

// Create/Edit Post Form Component
export const PostForm = () => {
	const { id } = useParams();
	const { posts, categories, createPost, updatePost, createCategory } =
		useContext(AppContext);
	const [formData, setFormData] = useState({
		title: "",
		content: "",
		category: "",
	});
	const [newCategory, setNewCategory] = useState("");
	const [showNewCategory, setShowNewCategory] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const isEditing = Boolean(id);

	useEffect(() => {
		if (isEditing) {
			const post = posts.find((p) => p._id === id);
			if (post) {
				setFormData({
					title: post.title,
					content: post.content,
					category: post.category?._id || "",
				});
			}
		}
	}, [id, posts, isEditing]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			if (isEditing) {
				await updatePost(id, formData);
			} else {
				await createPost(formData);
			}
			navigate("/");
		} catch (err) {
			setError("Error saving post. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleCreateCategory = async () => {
		if (!newCategory.trim()) return;

		try {
			const category = await createCategory({ name: newCategory.trim() });
			setFormData((prev) => ({ ...prev, category: category._id }));
			setNewCategory("");
			setShowNewCategory(false);
		} catch (err) {
			setError("Error creating category", err);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<button
				onClick={() => navigate("/")}
				className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
				<ArrowLeft className="w-4 h-4 mr-2" />
				Back to posts
			</button>

			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="px-8 py-6">
					<h1 className="text-3xl font-bold text-gray-900 mb-8">
						{isEditing ? "Edit Post" : "Create New Post"}
					</h1>

					{error && (
						<div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="title"
								className="block text-sm font-medium text-gray-700 mb-2">
								Title
							</label>
							<input
								type="text"
								id="title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter post title"
							/>
						</div>

						<div>
							<label
								htmlFor="category"
								className="block text-sm font-medium text-gray-700 mb-2">
								Category
							</label>
							<div className="flex space-x-2">
								<select
									id="category"
									name="category"
									value={formData.category}
									onChange={handleChange}
									className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
									<option value="">Select a category</option>
									{categories.map((category) => (
										<option
											key={category._id}
											value={category._id}>
											{category.name}
										</option>
									))}
								</select>
								<button
									type="button"
									onClick={() =>
										setShowNewCategory(!showNewCategory)
									}
									className="px-3 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md">
									<Plus className="w-5 h-5" />
								</button>
							</div>

							{showNewCategory && (
								<div className="mt-2 flex space-x-2">
									<input
										type="text"
										value={newCategory}
										onChange={(e) =>
											setNewCategory(e.target.value)
										}
										placeholder="New category name"
										className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									<button
										type="button"
										onClick={handleCreateCategory}
										className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
										<Save className="w-5 h-5" />
									</button>
									<button
										type="button"
										onClick={() => {
											setShowNewCategory(false);
											setNewCategory("");
										}}
										className="px-3 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">
										<X className="w-5 h-5" />
									</button>
								</div>
							)}
						</div>

						<div>
							<label
								htmlFor="content"
								className="block text-sm font-medium text-gray-700 mb-2">
								Content
							</label>
							<textarea
								id="content"
								name="content"
								value={formData.content}
								onChange={handleChange}
								required
								rows={12}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Write your post content here..."
							/>
						</div>

						<div className="flex justify-end space-x-4">
							<button
								type="button"
								onClick={() => navigate("/")}
								className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
								Cancel
							</button>
							<button
								type="submit"
								disabled={loading}
								className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
								{loading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Saving...
									</>
								) : (
									<>
										<Save className="w-4 h-4 mr-2" />
										{isEditing
											? "Update Post"
											: "Create Post"}
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
