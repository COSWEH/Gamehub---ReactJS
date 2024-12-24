import * as React from "react";
import { useState, useEffect } from "react";
import RawgApi from "../services/RawgApi";
import axios from "axios";

import { SearchForm } from "@/components/search-form";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function AppSidebar({ selectedGenre, setSelectedGenre, ...props }) {
	const key = RawgApi.key;
	const [genres, setGenres] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);

	const getGamesGenres = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				`https://api.rawg.io/api/genres?key=${key}`
			);

			if (response.status !== 200) {
				throw new Error("Failed to fetch data");
			}

			const data = response.data;
			setGenres(data.results);
			console.log(data);
		} catch (error) {
			console.error("Error fetching games:", error);
		} finally {
			setLoading(false);
		}
	};

	const filteredGenres = genres.filter((genre) =>
		genre.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	useEffect(() => {
		getGamesGenres();
	}, []);

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<h3
					className="text-2xl font-bold px-2 cursor-pointer"
					onClick={(e) => {
						e.preventDefault();
						setSelectedGenre(null);
					}}>
					<span className="text-green-500">Game</span>
					<span className="text-blue-500">Ooap</span>
				</h3>
				<SearchForm
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</SidebarHeader>
			<SidebarContent>
				{loading
					? Array.from({ length: 20 }).map((_, index) => (
							<Skeleton key={index} className="h-6 w-full rounded-md mb-3" />
					  ))
					: filteredGenres.map((genre) => (
							<SidebarGroup key={genre.id}>
								<SidebarGroupContent>
									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton asChild>
												<a
													href="#"
													onClick={(e) => {
														e.preventDefault();
														setSelectedGenre(genre.slug);
													}}
													className={`block px-4 py-2 rounded ${
														selectedGenre === genre.slug
															? "bg-gray-800 text-white"
															: ""
													}`}>
													{genre.name}
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
					  ))}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
