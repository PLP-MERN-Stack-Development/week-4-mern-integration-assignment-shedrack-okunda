// src/components/PostDetail.jsx
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { usePost } from "../hooks/useApi";
import Loading from "./Loading";
import ErrorDisplay from "./ErrorDisplay";
import ApiService from "../services/ApiService";

const PostDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { post, loading, error, fetchPost } = usePost(id);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const handleDelete = async () => {
		if (!window.confirm("Are you sure you want to delete this post?")) {
			return;
		}

		setDeleteLoading(true);
		try {
			await ApiService.deletePost(id);
			navigate("/");
		} catch (error) {
			console.error("Error deleting post:", error);
		} finally {
			setDeleteLoading(false);
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (loading) {
		return <Loading text="Loading post..." />;
	}

	if (error) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<ErrorDisplay error={error} onRetry={fetchPost} />
				<div className="text-center mt-8">
					<Link
						to="/"
						className="text-blue-600 hover:text-blue-800 font-medium">
						← Back to all posts
					</Link>
				</div>
			</div>
		);
	}

	if (!post) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="text-center py-12">
					<div className="text-gray-500 text-6xl mb-4">📄</div>
					<h2 className="text-xl font-semibold text-gray-700 mb-2">
						Post not found
					</h2>
					<p className="text-gray-500 mb-4">
						The post you're looking for doesn't exist.
					</p>
					<Link
						to="/"
						className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
						Back to Posts
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="mb-6">
				<Link
					to="/"
					className="text-blue-600 hover:text-blue-800 font-medium">
					← Back to all posts
				</Link>
			</div>

			<article className="bg-white rounded-lg shadow-md p-8">
				{/* Header */}
				<header className="mb-8">
					<div className="flex justify-between items-start mb-4">
						<div className="flex-1">
							<h1 className="text-3xl font-bold text-gray-900 mb-4">
								{post.title}
							</h1>
							<div className="flex items-center space-x-4 text-sm text-gray-500">
								<span>
									Published {formatDate(post.createdAt)}
								</span>
								{post.category && (
									<span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
										{post.category.name}
									</span>
								)}
								<span
									className={`px-3 py-1 rounded-full ${
										post.status === "published"
											? "bg-green-100 text-green-800"
											: "bg-yellow-100 text-yellow-800"
									}`}>
									{post.status}
								</span>
							</div>
						</div>
						<div className="flex space-x-3">
							<Link
								to={`/posts/${post._id}/edit`}
								className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
								Edit
							</Link>
							<button
								onClick={handleDelete}
								disabled={deleteLoading}
								className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center">
								{deleteLoading && (
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
								)}
								Delete
							</button>
						</div>
					</div>

					{post.updatedAt !== post.createdAt && (
						<p className="text-sm text-gray-500 mb-4">
							Last updated {formatDate(post.updatedAt)}
						</p>
					)}

					{post.tags && post.tags.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-6">
							{post.tags.map((tag, index) => (
								<span
									key={index}
									className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">
									#{tag}
								</span>
							))}
						</div>
					)}
				</header>

				{/* Content */}
				<div className="prose max-w-none">
					<div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
						{post.content}
					</div>
				</div>

				{/* Footer */}
				<footer className="mt-8 pt-8 border-t border-gray-200">
					<div className="flex justify-between items-center">
						<div className="text-sm text-gray-500">
							<p>Article ID: {post._id}</p>
						</div>
						<div className="flex space-x-4">
							<Link
								to={`/posts/${post._id}/edit`}
								className="text-blue-600 hover:text-blue-800 font-medium">
								Edit this post
							</Link>
							<Link
								to="/"
								className="text-gray-600 hover:text-gray-800 font-medium">
								All posts
							</Link>
						</div>
					</div>
				</footer>
			</article>
		</div>
	);
};

export default PostDetail;
