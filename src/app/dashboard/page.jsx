import React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import RawgApi from "@/services/RawgApi";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import Games from "@/components/Games";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

export default function Page({ selectedGenre, setSelectedGenre }) {
	const key = RawgApi.key;
	const [games, setGames] = useState([]);
	const [totalGames, setTotalGames] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const pageSize = 12;
	const navigate = useNavigate();
	const location = useLocation();
	const [searchGame, setSearchGame] = useState("");

	const getGames = useCallback(
		async (page = 1) => {
			setLoading(true);
			try {
				const genreFilter = selectedGenre ? `&genres=${selectedGenre}` : "";
				const response = await axios.get(
					`https://api.rawg.io/api/games?key=${key}&page_size=${pageSize}&page=${page}${genreFilter}`
				);

				if (response.status !== 200) {
					throw new Error("Failed to fetch data");
				}

				const data = response.data;
				setGames(data.results);
				setTotalGames(data.count); // Assuming the API response includes a count of total games
				console.log(data);
			} catch (error) {
				console.error("Error fetching games:", error);
			} finally {
				setLoading(false);
			}
		},
		[key, pageSize, selectedGenre]
	);

	const handleInputChange = (event) => {
		setSearchGame(event.target.value);

		console.log(searchGame);
	};

	useEffect(() => {
		const query = new URLSearchParams(location.search);
		const page = parseInt(query.get("page")) || 1;
		setCurrentPage(page);
		getGames(page);
	}, [location.search, getGames]);

	const totalPages = Math.min(Math.ceil(totalGames / pageSize));

	const handlePageChange = (page) => {
		navigate(`?page=${page}`);
		setCurrentPage(page);
	};

	const filteredGames = games.filter((game) =>
		game.name.toLowerCase().includes(searchGame.toLowerCase())
	);

	const paginationItems = useMemo(() => {
		const pageNumbers = [];
		const startPage = Math.max(currentPage - 5, 1);
		const endPage = Math.min(currentPage + 6, totalPages);

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(
				<PaginationItem key={i}>
					<PaginationLink
						href="#"
						onClick={(e) => {
							e.preventDefault();
							handlePageChange(i);
						}}
						className={`px-4 py-2 rounded ${
							currentPage === i
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700"
						}`}>
						{i}
					</PaginationLink>
				</PaginationItem>
			);
		}

		return pageNumbers;
	}, [currentPage, totalPages]);

	return (
		<SidebarProvider>
			<AppSidebar
				setSelectedGenre={setSelectedGenre}
				selectedGenre={selectedGenre}
			/>
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<ModeToggle />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<div className="relative w-full">
						<Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
						<Input
							className="pl-8"
							placeholder="Search games..."
							value={searchGame}
							onChange={handleInputChange}
						/>
					</div>
				</header>

				<div className="flex flex-1 flex-col gap-4 p-4">
					<h1 className="text-3xl font-semibold">Games</h1>
					<hr />
					{loading ? (
						<div className="grid auto-rows-min gap-4 md:grid-cols-3 xl:grid-cols-4">
							{Array.from({ length: pageSize + 4 }).map((_, index) => (
								<Skeleton key={index} className="h-60 w-full rounded-md" />
							))}
						</div>
					) : (
						<div className="grid auto-rows-min gap-4 md:grid-cols-3 xl:grid-cols-4">
							{filteredGames.map((game) => (
								<Games
									key={game.id}
									game={game}
									selectedGenre={selectedGenre}
								/>
							))}
						</div>
					)}
				</div>

				<Pagination className="mb-5">
					<PaginationPrevious
						className="cursor-pointer m-1"
						onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
						disabled={currentPage === 1}>
						<PaginationLink href="#">Previous</PaginationLink>
					</PaginationPrevious>
					<PaginationContent>{paginationItems}</PaginationContent>
					<PaginationNext
						className="cursor-pointer m-1"
						onClick={() =>
							handlePageChange(Math.min(currentPage + 1, totalPages))
						}
						disabled={currentPage === totalPages}>
						<PaginationLink href="#">Next</PaginationLink>
					</PaginationNext>
				</Pagination>
			</SidebarInset>
		</SidebarProvider>
	);
}
