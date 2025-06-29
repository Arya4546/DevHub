import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/Auth/Signup";
import Login from "../pages/Auth/Login";
import Feed from "../pages/Feed";
import BugReports from "../pages/BugReports";
import Chat from "../pages/Chat";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import PairUp from "../pages/PairUp";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  const token = localStorage.getItem("devhub_token");

  return (
    <Routes>
      {/* If not logged in, show login; otherwise redirect to /feed */}
      <Route
        path="/"
        element={
          token ? <Navigate to="/feed" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/feed"
        element={
          <PrivateRoute>
            <Feed />
          </PrivateRoute>
        }
      />
      <Route
        path="/bugs"
        element={
          <PrivateRoute>
            <BugReports />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/pairup"
        element={
          <PrivateRoute>
            <PairUp />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
