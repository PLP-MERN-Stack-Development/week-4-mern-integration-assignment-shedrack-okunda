// import { useState } from "react";
// import { useEffect } from "react";
// import { useApi } from "../hooks/Api";
// import { createContext } from "react";

// const AppContext = createContext();

// // Context Provider
// export const AppProvider = ({ children }) => {
// 	const [posts, setPosts] = useState([]);
// 	const [categories, setCategories] = useState([]);
// 	const { apiCall } = useApi();

// 	const fetchPosts = async () => {
// 		try {
// 			const data = await apiCall("/posts");
// 			setPosts(data);
// 		} catch (err) {
// 			console.error("Error fetching posts:", err);
// 		}
// 	};

// 	const fetchCategories = async () => {
// 		try {
// 			const data = await apiCall("/categories");
// 			setCategories(data);
// 		} catch (err) {
// 			console.error("Error fetching categories:", err);
// 		}
// 	};

// 	const createPost = async (postData) => {
// 		try {
// 			const newPost = await apiCall("/posts", {
// 				method: "POST",
// 				body: JSON.stringify(postData),
// 			});
// 			setPosts((prev) => [newPost, ...prev]);
// 			return newPost;
// 		} catch (err) {
// 			console.error("Error creating post:", err);
// 			throw err;
// 		}
// 	};

// 	const updatePost = async (id, postData) => {
// 		try {
// 			const updatedPost = await apiCall(`/posts/${id}`, {
// 				method: "PUT",
// 				body: JSON.stringify(postData),
// 			});
// 			setPosts((prev) =>
// 				prev.map((post) => (post._id === id ? updatedPost : post))
// 			);
// 			return updatedPost;
// 		} catch (err) {
// 			console.error("Error updating post:", err);
// 			throw err;
// 		}
// 	};

// 	const deletePost = async (id) => {
// 		try {
// 			await apiCall(`/posts/${id}`, { method: "DELETE" });
// 			setPosts((prev) => prev.filter((post) => post._id !== id));
// 		} catch (err) {
// 			console.error("Error deleting post:", err);
// 			throw err;
// 		}
// 	};

// 	const createCategory = async (categoryData) => {
// 		try {
// 			const newCategory = await apiCall("/categories", {
// 				method: "POST",
// 				body: JSON.stringify(categoryData),
// 			});
// 			setCategories((prev) => [...prev, newCategory]);
// 			return newCategory;
// 		} catch (err) {
// 			console.error("Error creating category:", err);
// 			throw err;
// 		}
// 	};

// 	useEffect(() => {
// 		fetchPosts();
// 		fetchCategories();
// 	}, []);

// 	return (
// 		<AppContext.Provider
// 			value={{
// 				posts,
// 				categories,
// 				createPost,
// 				updatePost,
// 				deletePost,
// 				createCategory,
// 				fetchPosts,
// 				fetchCategories,
// 			}}>
// 			{children}
// 		</AppContext.Provider>
// 	);
// };
