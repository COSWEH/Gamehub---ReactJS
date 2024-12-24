import React from "react";
import {
	FaRegStar,
	FaStar,
	FaStarHalfAlt,
	FaArrowAltCircleRight,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { NavLink } from "react-router-dom";

const Games = React.memo(({ game }) => {
	const getRatingStars = (rating) => {
		const fullStars = Math.floor(rating);
		const halfStars = rating % 1 >= 0.5 ? 1 : 0;
		const emptyStars = 5 - fullStars - halfStars;

		return (
			<>
				{Array(fullStars)
					.fill(<FaStar className="text-yellow-500" />)
					.map((star, index) => (
						<span key={`full-${index}`}>{star}</span>
					))}
				{halfStars === 1 && <FaStarHalfAlt className="text-yellow-500" />}
				{Array(emptyStars)
					.fill(<FaRegStar className="text-yellow-500" />)
					.map((star, index) => (
						<span key={`empty-${index}`}>{star}</span>
					))}
			</>
		);
	};

	return (
		<div>
			<Card key={game.id}>
				<CardHeader className="p-0">
					<img
						src={game.background_image}
						alt={game.name}
						className="object-cover w-full h-40 rounded-t-md"
					/>
				</CardHeader>
				<CardContent>
					<CardTitle className="mt-3 text-xl">{game.name}</CardTitle>
					<div className="flex items-center space-x-2 mt-2">
						<CardDescription className="font-semibold">
							{game.rating}
						</CardDescription>
						<CardDescription className="flex items-center">
							{getRatingStars(game.rating)}
						</CardDescription>
					</div>
				</CardContent>
				<CardFooter>
					<NavLink
						to={`/game-details/${game.id}`}
						className="inline-block mb-6">
						<Button>
							<FaArrowAltCircleRight className="mr-2 h-4 w-4" /> See Details
						</Button>
					</NavLink>
				</CardFooter>
			</Card>
		</div>
	);
});

export default Games;
