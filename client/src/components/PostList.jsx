// src/components/PostList.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import ErrorDisplay from "./ErrorDisplay";
import { useApp } from "../services/ContextApi";
import { useOptimisticPosts } from "../hooks/useOptimistincUI";
import ApiService from "../services/ApiService";

const PostList = () => {
	const { posts, loading, error, clearError } = useApp();
	const [deleteLoading, setDeleteLoading] = useState(null);

	const {
		posts: optimisticPosts,
		deletePostOptimistic,
		error: optimisticError,
	} = useOptimisticPosts(posts);

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this post?")) {
			return;
		}

		setDeleteLoading(id);
		try {
			await deletePostOptimistic(id, () => ApiService.deletePost(id));
		} catch (error) {
			console.error("Error deleting post:", error);
		} finally {
			setDeleteLoading(null);
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const truncateContent = (content, maxLength = 150) => {
		if (content.length <= maxLength) return content;
		return content.substring(0, maxLength) + "...";
	};

	if (loading) {
		return <Loading text="Loading posts..." />;
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
				<Link
					to="/posts/new"
					className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
					Create New Post
				</Link>
			</div>

			<ErrorDisplay
				error={error || optimisticError}
				onDismiss={clearError}
			/>

			{optimisticPosts.length === 0 ? (
				<div className="text-center py-12">
					<div className="text-gray-500 text-6xl mb-4">📝</div>
					<h2 className="text-xl font-semibold text-gray-700 mb-2">
						No posts yet
					</h2>
					<p className="text-gray-500 mb-4">
						Get started by creating your first blog post!
					</p>
					<Link
						to="/posts/new"
						className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
						Create First Post
					</Link>
				</div>
			) : (
				<div className="space-y-6">
					{optimisticPosts.map((post) => (
						<div
							key={post._id}
							className={`bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg ${
								post._id.startsWith("temp-") ? "opacity-70" : ""
							}`}>
							<div className="flex justify-between items-start mb-4">
								<div className="flex-1">
									<Link
										to={`/posts/${post._id}`}
										className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
										{post.title}
									</Link>
									<div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
										<span>
											{formatDate(post.createdAt)}
										</span>
										{post.category && (
											<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
												{post.category.name}
											</span>
										)}
										<span
											className={`px-2 py-1 rounded-full text-xs ${
												post.status === "published"
													? "bg-green-100 text-green-800"
													: "bg-yellow-100 text-yellow-800"
											}`}>
											{post.status}
										</span>
									</div>
								</div>
								<div className="flex space-x-2">
									<Link
										to={`/posts/${post._id}/edit`}
										className="text-blue-600 hover:text-blue-800 text-sm font-medium">
										Edit
									</Link>
									<button
										onClick={() => handleDelete(post._id)}
										disabled={
											deleteLoading === post._id ||
											post._id.startsWith("temp-")
										}
										className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50">
										{deleteLoading === post._id ? (
											<div className="flex items-center">
												<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
												Deleting...
											</div>
										) : (
											"Delete"
										)}
									</button>
								</div>
							</div>

							<p className="text-gray-700 mb-4">
								{truncateContent(post.content)}
							</p>

							{post.tags && post.tags.length > 0 && (
								<div className="flex flex-wrap gap-2 mb-4">
									{post.tags.map((tag, index) => (
										<span
											key={index}
											className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">
											#{tag}
										</span>
									))}
								</div>
							)}

							<div className="flex justify-between items-center">
								<Link
									to={`/posts/${post._id}`}
									className="text-blue-600 hover:text-blue-800 text-sm font-medium">
									Read more →
								</Link>
								{post.updatedAt !== post.createdAt && (
									<span className="text-xs text-gray-400">
										Updated {formatDate(post.updatedAt)}
									</span>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default PostList;
