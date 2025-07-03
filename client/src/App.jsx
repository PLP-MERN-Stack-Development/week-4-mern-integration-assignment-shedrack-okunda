// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppProvider } from "./services/ContextApi";
import Navigation from "./components/Navigation";
import PostList from "./components/PostList";
import PostForm from "./components/FormPost";
import PostDetail from "./components/PostDetail";

function App() {
	return (
		<ErrorBoundary>
			<AppProvider>
				<Router>
					<div className="min-h-screen bg-gray-50">
						<Navigation />
						<main className="container mx-auto px-4 py-8">
							<Routes>
								<Route path="/" element={<PostList />} />
								<Route
									path="/posts/new"
									element={<PostForm />}
								/>
								<Route
									path="/posts/:id"
									element={<PostDetail />}
								/>
								<Route
									path="/posts/:id/edit"
									element={<PostForm />}
								/>
								<Route path="*" element={<NotFound />} />
							</Routes>
						</main>
					</div>
				</Router>
			</AppProvider>
		</ErrorBoundary>
	);
}

const NotFound = () => (
	<div className="text-center py-12">
		<div className="text-gray-500 text-6xl mb-4">🔍</div>
		<h2 className="text-2xl font-bold text-gray-700 mb-2">
			Page Not Found
		</h2>
		<p className="text-gray-500 mb-4">
			The page you're looking for doesn't exist.
		</p>
		<a
			href="/"
			className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
			Go Home
		</a>
	</div>
);

export default App;
