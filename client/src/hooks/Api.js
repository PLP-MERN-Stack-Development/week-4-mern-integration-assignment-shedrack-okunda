import { useState } from "react";

// Custom hook for API calls
export const useApi = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const apiCall = async (url, options = {}) => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api${url}`, {
				headers: {
					"Content-Type": "application/json",
					...options.headers,
				},
				...options,
			});

			if (!response.ok) {
				throw new Error(`API Error: ${response.status}`);
			}

			const data = await response.json();
			return data;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { apiCall, loading, error };
};
