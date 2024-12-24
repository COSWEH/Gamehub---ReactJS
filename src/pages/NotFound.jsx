import React from "react";
import { NavLink } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

function NotFound() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle className="flex items-center justify-center text-3xl font-bold">
						<FaExclamationCircle className="mr-2 h-6 w-6 text-destructive" />
						404 Not Found
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-center text-muted-foreground">
						Oops! The page you're looking for doesn't exist.
					</p>
				</CardContent>
				<CardFooter className="flex justify-center">
					<NavLink to="/">
						<Button>Go back home</Button>
					</NavLink>
				</CardFooter>
			</Card>
		</div>
	);
}

export default NotFound;
