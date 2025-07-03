import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

// Navigation Component
const Navigation = () => {
	return (
		<nav className="bg-white shadow-md border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center">
						<Link
							to="/"
							className="text-2xl font-bold text-blue-600 hover:text-blue-800">
							BlogApp
						</Link>
					</div>
					<div className="flex space-x-4">
						<Link
							to="/"
							className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
							Home
						</Link>
						<Link
							to="/posts/new"
							className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
							<Plus className="w-4 h-4 mr-2" />
							Create Post
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navigation;
