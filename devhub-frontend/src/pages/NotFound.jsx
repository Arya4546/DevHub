import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-lg mb-6">Page not found.</p>
      <Link
        to="/"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Go Home
      </Link>
    </div>
  );
}