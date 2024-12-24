import React, { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Page from "/src/app/dashboard/page";
import GameDetails from "../src/pages/GameDetails";
import NotFound from "./pages/NotFound";

function App() {
	const [selectedGenre, setSelectedGenre] = useState(null);
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Router>
				<Routes>
					<Route
						path="/"
						element={
							<Page
								selectedGenre={selectedGenre}
								setSelectedGenre={setSelectedGenre}
							/>
						}
					/>
					<Route path="/game-details/:id" element={<GameDetails />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</ThemeProvider>
	);
}

export default App;
