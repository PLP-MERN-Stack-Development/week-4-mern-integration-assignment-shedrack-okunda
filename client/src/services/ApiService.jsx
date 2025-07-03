// src/services/apiService.js
const API_BASE_URL =
	import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiService {
	constructor() {
		this.baseURL = API_BASE_URL;
	}

	// Generic request method
	async request(endpoint, options = {}) {
		const url = `${this.baseURL}${endpoint}`;

		const config = {
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			...options,
		};

		try {
			const response = await fetch(url, config);

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(
					errorData?.message ||
						`HTTP error! status: ${response.status}`
				);
			}

			return await response.json();
		} catch (error) {
			console.error("API request failed:", error);
			throw error;
		}
	}

	// Posts API methods
	async getPosts() {
		return this.request("/posts");
	}

	async getPost(id) {
		return this.request(`/posts/${id}`);
	}

	async createPost(postData) {
		return this.request("/posts", {
			method: "POST",
			body: JSON.stringify(postData),
		});
	}

	async updatePost(id, postData) {
		return this.request(`/posts/${id}`, {
			method: "PUT",
			body: JSON.stringify(postData),
		});
	}

	async deletePost(id) {
		return this.request(`/posts/${id}`, {
			method: "DELETE",
		});
	}

	// Categories API methods
	async getCategories() {
		return this.request("/categories");
	}

	async createCategory(categoryData) {
		return this.request("/categories", {
			method: "POST",
			body: JSON.stringify(categoryData),
		});
	}
}

export default new ApiService();
