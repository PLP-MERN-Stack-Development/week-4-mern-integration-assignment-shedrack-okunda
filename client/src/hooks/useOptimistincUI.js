// src/hooks/useOptimisticUI.js
import { useState, useCallback } from "react";

export function useOptimisticUI(initialData = []) {
	const [data, setData] = useState(initialData);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const executeOptimistic = useCallback(
		async (optimisticUpdate, apiCall, rollbackUpdate = null) => {
			setLoading(true);
			setError(null);

			// Apply optimistic update immediately
			const previousData = data;
			setData(optimisticUpdate);

			try {
				// Execute the actual API call
				const result = await apiCall();

				// Update with real data if API call succeeds
				if (result !== undefined) {
					setData(result);
				}

				return result;
			} catch (err) {
				// Rollback on error
				if (rollbackUpdate) {
					setData(rollbackUpdate);
				} else {
					setData(previousData);
				}

				setError(err.message);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[data]
	);

	const reset = useCallback(() => {
		setData(initialData);
		setError(null);
		setLoading(false);
	}, [initialData]);

	return {
		data,
		loading,
		error,
		executeOptimistic,
		reset,
		setData,
		setError,
		setLoading,
	};
}

// Specific hook for optimistic post operations
export function useOptimisticPosts(initialPosts = []) {
	const {
		data: posts,
		loading,
		error,
		executeOptimistic,
		reset,
		setData: setPosts,
		setError,
	} = useOptimisticUI(initialPosts);

	const addPostOptimistic = useCallback(
		async (postData, apiCall) => {
			const tempId = `temp-${Date.now()}`;
			const optimisticPost = {
				...postData,
				_id: tempId,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			const optimisticUpdate = [optimisticPost, ...posts];

			return executeOptimistic(optimisticUpdate, async () => {
				const realPost = await apiCall();
				return [realPost, ...posts];
			});
		},
		[posts, executeOptimistic]
	);

	const updatePostOptimistic = useCallback(
		async (id, postData, apiCall) => {
			const optimisticUpdate = posts.map((post) =>
				post._id === id
					? {
							...post,
							...postData,
							updatedAt: new Date().toISOString(),
					  }
					: post
			);

			return executeOptimistic(optimisticUpdate, async () => {
				const updatedPost = await apiCall();
				return posts.map((post) =>
					post._id === id ? updatedPost : post
				);
			});
		},
		[posts, executeOptimistic]
	);

	const deletePostOptimistic = useCallback(
		async (id, apiCall) => {
			const optimisticUpdate = posts.filter((post) => post._id !== id);

			return executeOptimistic(optimisticUpdate, apiCall);
		},
		[posts, executeOptimistic]
	);

	return {
		posts,
		loading,
		error,
		addPostOptimistic,
		updatePostOptimistic,
		deletePostOptimistic,
		setPosts,
		setError,
		reset,
	};
}
