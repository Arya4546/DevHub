import { useEffect, useState } from "react";
import { socket } from "../socket";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("pairup_sent", (data) => {
      setNotifications((prev) => [...prev, { type: "sent", ...data }]);
    });

    socket.on("pairup_accepted", (data) => {
      setNotifications((prev) => [...prev, { type: "accepted", ...data }]);
    });

    return () => {
      socket.off("pairup_sent");
      socket.off("pairup_accepted");
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-b from-black via-[#0d0d0d] to-[#1a0000] text-white">
      <Sidebar />
      <main className="relative flex-1 h-screen overflow-y-auto scroll-smooth">
        <Navbar />
        <div className="p-4 max-w-3xl mx-auto pb-24">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-red-600">Notifications</h1>
          </div>

          {notifications.length === 0 ? (
            <p className="text-gray-400">No notifications yet.</p>
          ) : (
            <ul className="space-y-4">
              {notifications.map((n, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-[#1e1e1e] border border-gray-700 p-5 rounded-lg shadow hover:shadow-lg transition"
                >
                  <p className="text-gray-200">{n.message}</p>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
