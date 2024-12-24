import React, { createContext, useContext, useState, useEffect } from "react";

const initialState = {
	theme: "system",
	setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "vite-ui-theme",
	...props
}) {
	const [theme, setTheme] = useState(() => {
		const storedTheme = localStorage.getItem(storageKey);
		return storedTheme ? storedTheme : defaultTheme;
	});

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			root.classList.add(systemTheme);
		} else {
			root.classList.add(theme);
		}

		localStorage.setItem(storageKey, theme);
	}, [theme, storageKey]);

	return (
		<ThemeProviderContext.Provider value={{ theme, setTheme }} {...props}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export function useTheme() {
	return useContext(ThemeProviderContext);
}
