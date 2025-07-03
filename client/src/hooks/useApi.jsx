// src/hooks/useApi.js
import { useState, useEffect } from "react";
import ApiService from "../services/ApiService";

export function useApi(endpoint, options = {}) {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const { immediate = true, deps = [] } = options;

	const execute = async (customEndpoint = endpoint, customOptions = {}) => {
		setLoading(true);
		setError(null);

		try {
			const result = await ApiService.request(
				customEndpoint,
				customOptions
			);
			setData(result);
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (immediate && endpoint) {
			execute();
		}
	}, deps);

	return { data, loading, error, execute };
}

// Specialized hooks for different operations
export function usePosts() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchPosts = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await ApiService.getPosts();
			setPosts(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const createPost = async (postData) => {
		setLoading(true);
		setError(null);
		try {
			const newPost = await ApiService.createPost(postData);
			setPosts((prev) => [newPost, ...prev]);
			return newPost;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updatePost = async (id, postData) => {
		setLoading(true);
		setError(null);
		try {
			const updatedPost = await ApiService.updatePost(id, postData);
			setPosts((prev) =>
				prev.map((post) => (post._id === id ? updatedPost : post))
			);
			return updatedPost;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const deletePost = async (id) => {
		setLoading(true);
		setError(null);
		try {
			await ApiService.deletePost(id);
			setPosts((prev) => prev.filter((post) => post._id !== id));
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	return {
		posts,
		loading,
		error,
		fetchPosts,
		createPost,
		updatePost,
		deletePost,
	};
}

export function usePost(id) {
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchPost = async () => {
		if (!id) return;

		setLoading(true);
		setError(null);
		try {
			const data = await ApiService.getPost(id);
			setPost(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPost();
	}, [id]);

	return { post, loading, error, fetchPost };
}

export function useCategories() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchCategories = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await ApiService.getCategories();
			setCategories(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const createCategory = async (categoryData) => {
		setLoading(true);
		setError(null);
		try {
			const newCategory = await ApiService.createCategory(categoryData);
			setCategories((prev) => [...prev, newCategory]);
			return newCategory;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	return {
		categories,
		loading,
		error,
		fetchCategories,
		createCategory,
	};
}
