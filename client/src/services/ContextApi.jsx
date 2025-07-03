// src/context/AppContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import ApiService from "./ApiService";

// Action types
const ACTIONS = {
	SET_LOADING: "SET_LOADING",
	SET_ERROR: "SET_ERROR",
	SET_POSTS: "SET_POSTS",
	SET_CATEGORIES: "SET_CATEGORIES",
	ADD_POST: "ADD_POST",
	UPDATE_POST: "UPDATE_POST",
	DELETE_POST: "DELETE_POST",
	ADD_CATEGORY: "ADD_CATEGORY",
	CLEAR_ERROR: "CLEAR_ERROR",
};

// Initial state
const initialState = {
	posts: [],
	categories: [],
	loading: false,
	error: null,
};

// Reducer function
function appReducer(state, action) {
	switch (action.type) {
		case ACTIONS.SET_LOADING:
			return { ...state, loading: action.payload };

		case ACTIONS.SET_ERROR:
			return { ...state, error: action.payload, loading: false };

		case ACTIONS.CLEAR_ERROR:
			return { ...state, error: null };

		case ACTIONS.SET_POSTS:
			return { ...state, posts: action.payload, loading: false };

		case ACTIONS.SET_CATEGORIES:
			return { ...state, categories: action.payload, loading: false };

		case ACTIONS.ADD_POST:
			return {
				...state,
				posts: [action.payload, ...state.posts],
				loading: false,
			};

		case ACTIONS.UPDATE_POST:
			return {
				...state,
				posts: state.posts.map((post) =>
					post._id === action.payload._id ? action.payload : post
				),
				loading: false,
			};

		case ACTIONS.DELETE_POST:
			return {
				...state,
				posts: state.posts.filter(
					(post) => post._id !== action.payload
				),
				loading: false,
			};

		case ACTIONS.ADD_CATEGORY:
			return {
				...state,
				categories: [...state.categories, action.payload],
				loading: false,
			};

		default:
			return state;
	}
}

// Context creation
const AppContext = createContext();

// Context provider component
export function AppProvider({ children }) {
	const [state, dispatch] = useReducer(appReducer, initialState);

	// Fetch initial data
	useEffect(() => {
		fetchPosts();
		fetchCategories();
	}, []);

	// Action creators
	const fetchPosts = async () => {
		dispatch({ type: ACTIONS.SET_LOADING, payload: true });
		try {
			const posts = await ApiService.getPosts();
			dispatch({ type: ACTIONS.SET_POSTS, payload: posts });
		} catch (error) {
			dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
		}
	};

	const fetchCategories = async () => {
		try {
			const categories = await ApiService.getCategories();
			dispatch({ type: ACTIONS.SET_CATEGORIES, payload: categories });
		} catch (error) {
			dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
		}
	};

	const createPost = async (postData) => {
		dispatch({ type: ACTIONS.SET_LOADING, payload: true });
		try {
			const newPost = await ApiService.createPost(postData);
			dispatch({ type: ACTIONS.ADD_POST, payload: newPost });
			return newPost;
		} catch (error) {
			dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
			throw error;
		}
	};

	const updatePost = async (id, postData) => {
		dispatch({ type: ACTIONS.SET_LOADING, payload: true });
		try {
			const updatedPost = await ApiService.updatePost(id, postData);
			dispatch({ type: ACTIONS.UPDATE_POST, payload: updatedPost });
			return updatedPost;
		} catch (error) {
			dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
			throw error;
		}
	};

	const deletePost = async (id) => {
		dispatch({ type: ACTIONS.SET_LOADING, payload: true });
		try {
			await ApiService.deletePost(id);
			dispatch({ type: ACTIONS.DELETE_POST, payload: id });
		} catch (error) {
			dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
			throw error;
		}
	};

	const createCategory = async (categoryData) => {
		try {
			const newCategory = await ApiService.createCategory(categoryData);
			dispatch({ type: ACTIONS.ADD_CATEGORY, payload: newCategory });
			return newCategory;
		} catch (error) {
			dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
			throw error;
		}
	};

	const clearError = () => {
		dispatch({ type: ACTIONS.CLEAR_ERROR });
	};

	const value = {
		...state,
		fetchPosts,
		fetchCategories,
		createPost,
		updatePost,
		deletePost,
		createCategory,
		clearError,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the context
export function useApp() {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useApp must be used within an AppProvider");
	}
	return context;
}

export default AppContext;
