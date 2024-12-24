import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import axios from "axios";
import RawgApi from "@/services/RawgApi";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardTitle,
	CardContent,
	CardDescription,
	CardHeader,
	CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
	FaArrowAltCircleLeft,
	FaStar,
	FaCalendar,
	FaUser,
	FaTv,
} from "react-icons/fa";

const GameDetails = () => {
	const { id } = useParams();
	const [game, setGame] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [showMore, setShowMore] = useState(false);

	const key = RawgApi.key;

	const getGameDetails = async () => {
		try {
			const response = await axios.get(
				`https://api.rawg.io/api/games/${id}?key=${key}`
			);

			if (response.status !== 200) {
				throw new Error("Failed to fetch data");
			}

			const data = response.data;
			setGame(data);
			setError(false);
		} catch (error) {
			console.error("Error fetching game details:", error);
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getGameDetails();
	}, [id]);

	if (loading) {
		return (
			<div className="container mx-auto p-6">
				<Skeleton className="w-full h-[400px] rounded-lg mb-6" />
				<Skeleton className="w-3/4 h-10 mb-4" />
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Skeleton className="h-40" />
					<Skeleton className="h-40" />
					<Skeleton className="h-40" />
					<Skeleton className="h-40" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center px-6">
				<Card className="max-w-md mx-auto mt-20 ">
					<CardHeader>
						<CardTitle className="text-red-500">Error</CardTitle>
					</CardHeader>
					<CardContent>
						<p>Unable to load game details. Please try again later.</p>
					</CardContent>
					<CardFooter>
						<NavLink to="/">
							<Button>
								<FaArrowAltCircleLeft className="mr-2 h-4 w-4" /> Back to Games
							</Button>
						</NavLink>
					</CardFooter>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6">
			<NavLink to="/" className="inline-block mb-6">
				<Button>
					<FaArrowAltCircleLeft className="mr-2 h-4 w-4" /> Back to Games
				</Button>
			</NavLink>

			<Card className="mb-6 overflow-hidden">
				<div className="relative h-[400px]">
					<img
						src={game.background_image || "/placeholder-image.jpg"}
						alt={game.name}
						className="object-cover w-full h-full"
					/>

					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
						<h1 className="text-4xl font-bold text-white mb-2">{game.name}</h1>
						<div className="flex items-center space-x-2">
							<Badge className="px-3 py-1">
								<FaStar className="mr-1 h-4 w-4" />
								{game.rating}
							</Badge>
							{game.released && (
								<Badge className="px-3 py-1">
									<FaCalendar className="mr-1 h-4 w-4" />
									{new Date(game.released).getFullYear()}
								</Badge>
							)}
						</div>
					</div>
				</div>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<FaUser className="mr-2 h-5 w-5" /> Genres
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{game.genres.map((genre) => (
								<Badge key={genre.id} className="px-3 py-1">
									{genre.name}
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<FaTv className="mr-2 h-5 w-5" /> Platforms
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{game.platforms.map((platform) => (
								<Badge key={platform.platform.id}>
									{platform.platform.name}
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>

				{game.description_raw && (
					<Card className="md:col-span-2">
						<CardHeader>
							<CardTitle>Description</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription>
								{showMore
									? game.description_raw
									: `${game.description_raw.slice(0, 300)}...`}
							</CardDescription>

							<div className="mt-3">
								<Button
									variant="secondary"
									size="sm"
									onClick={() => setShowMore((prev) => !prev)} // Toggle the showMore state
								>
									{showMore ? "Show less" : "Show more"}
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
};

export default GameDetails;
