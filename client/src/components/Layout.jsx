import Navigation from "./Navigation";

// Layout Component
export const Layout = ({ children }) => {
	return (
		<div className="min-h-screen bg-gray-50">
			<Navigation />
			<main>{children}</main>
		</div>
	);
};
