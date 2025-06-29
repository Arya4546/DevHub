import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <button
      onClick={toggleTheme}
      className="text-sm text-white bg-gray-800 px-3 py-1 rounded hover:bg-gray-700"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"} Mode
    </button>
  );
}