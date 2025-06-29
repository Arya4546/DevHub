import { NavLink } from "react-router-dom";
import { FiHome, FiUser, FiMessageCircle, FiAlertCircle, FiUsers } from "react-icons/fi";

export default function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar (visible on md and larger screens) */}
      <aside className="hidden md:flex md:flex-col fixed top-0 left-0 w-64 h-screen bg-gray-900 p-6 border-r border-gray-800 space-y-8 z-20">
        <h1 className="text-2xl font-bold text-red-500">DevHub</h1>
        <nav className="space-y-4">
          <NavItem to="/feed" icon={<FiHome />} label="Feed" />
          <NavItem to="/bugs" icon={<FiAlertCircle />} label="Bug Reports" />
          <NavItem to="/chat" icon={<FiMessageCircle />} label="Chat" />
          <NavItem to="/profile/1" icon={<FiUser />} label="Profile" />
          <NavItem to="/pairup" icon={<FiUsers />} label="PairUp" />
        </nav>
      </aside>

      {/* Mobile Bottom Navigation (visible on small screens) */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-20">
        <NavItem to="/feed" icon={<FiHome />} />
        <NavItem to="/bugs" icon={<FiAlertCircle />} />
        <NavItem to="/chat" icon={<FiMessageCircle />} />
        <NavItem to="/profile/1" icon={<FiUser />} />
      
        <NavItem to="/pairup" icon={<FiUsers />} />
      </nav>
    </>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 p-3 md:rounded-lg transition duration-200 ${
          isActive
            ? "bg-red-600 text-white"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      {label && <span className="text-sm font-medium hidden md:inline">{label}</span>}
    </NavLink>
  );
}