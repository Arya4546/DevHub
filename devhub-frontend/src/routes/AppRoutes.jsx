import { Routes, Route } from "react-router-dom";
import Signup from "../pages/Auth/Signup";
import Login from "../pages/Auth/Login";
import Feed from "../pages/Feed";
import BugReports from "../pages/BugReports";
import Chat from "../pages/Chat";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import PairUp from "../pages/PairUp";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/bugs" element={<BugReports />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
     
      <Route path="/pairup" element={<PairUp />} />

    </Routes>
  );
}