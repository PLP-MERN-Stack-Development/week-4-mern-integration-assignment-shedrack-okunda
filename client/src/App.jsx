import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import {
	AppProvider,
	PostForm,
	PostList,
	SinglePostView,
} from "./components/Post";

function App() {
	return (
		<Router>
			<AppProvider>
				<Layout>
					<Routes>
						<Route path="/" element={<PostList />} />
						<Route path="/post/:id" element={<SinglePostView />} />
						<Route path="/create" element={<PostForm />} />
						<Route path="/edit/:id" element={<PostForm />} />
					</Routes>
				</Layout>
			</AppProvider>
		</Router>
	);
}

export default App;
