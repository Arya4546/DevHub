import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { socket } from "../socket";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PairUp() {
  const [connections, setConnections] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [developers, setDevelopers] = useState([]);

  const [connectionSearch, setConnectionSearch] = useState("");
  const [developerSearch, setDeveloperSearch] = useState("");

  const token = localStorage.getItem("devhub_token");
  const myId = localStorage.getItem("devhub_userId");

  useEffect(() => {
    fetchAll();

    socket.on("pairup_sent", fetchAll);
    socket.on("pairup_accepted", fetchAll);
    socket.on("pairup_rejected", fetchAll);
    socket.on("pairup_withdrawn", fetchAll);

    return () => {
      socket.off("pairup_sent", fetchAll);
      socket.off("pairup_accepted", fetchAll);
      socket.off("pairup_rejected", fetchAll);
      socket.off("pairup_withdrawn", fetchAll);
    };
  }, []);

  const fetchAll = async () => {
    try {
      const [pairUpsRes, devsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/pairups`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/api/pairups/discover`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setConnections(pairUpsRes.data.paired || []);
      setIncoming(pairUpsRes.data.incoming || []);
      setDevelopers(devsRes.data.developers || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const sendPairUp = async (toId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/pairups`, { to: toId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAll();
    } catch (err) {
      console.error("Send PairUp Error:", err);
    }
  };

  const withdrawPairUp = async (pairUpId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/pairups/${pairUpId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAll();
    } catch (err) {
      console.error("Withdraw PairUp Error:", err);
    }
  };

  const acceptPairUp = async (pairUpId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/pairups/${pairUpId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAll();
    } catch (err) {
      console.error("Accept PairUp Error:", err);
    }
  };

  const rejectPairUp = async (pairUpId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/pairups/${pairUpId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAll();
    } catch (err) {
      console.error("Reject PairUp Error:", err);
    }
  };

  const getProfileImageUrl = (profileImageUrl) => {
    if (!profileImageUrl) return "/default-avatar.png";
    if (profileImageUrl.startsWith("http")) return profileImageUrl;
    if (profileImageUrl.startsWith("/uploads"))
      return `${API_BASE_URL}${profileImageUrl}`;
    return `${API_BASE_URL}/uploads/${profileImageUrl}`;
  };

  // Filtered connections & developers
  const filteredConnections = connections.filter((pair) => {
    const other = pair.from._id === myId ? pair.to : pair.from;
    return other.name.toLowerCase().includes(connectionSearch.toLowerCase());
  });

  const filteredDevelopers = developers.filter((dev) =>
    dev.name.toLowerCase().includes(developerSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-black via-[#0d0d0d] to-[#1a0000] text-white">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto">
        <Navbar />
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-red-600 mb-6">PairUps</h1>

          {/* ✅ Your Connections */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Your Connections</h2>

            <input
              type="text"
              value={connectionSearch}
              onChange={(e) => setConnectionSearch(e.target.value)}
              placeholder="Search connections..."
              className="mb-4 w-full p-2 rounded bg-[#1e1e1e] border border-gray-600 focus:outline-none"
            />

            {filteredConnections.length === 0 ? (
              <p className="text-gray-400">No connections found.</p>
            ) : (
              <div className="flex overflow-x-auto gap-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-[#141414] pb-2">
                {filteredConnections.map((pair) => {
                  const other = pair.from._id === myId ? pair.to : pair.from;
                  return (
                    <div
                      key={other._id}
                      className="min-w-[150px] bg-[#1e1e1e] p-4 rounded-lg flex flex-col items-center"
                    >
                      <img
                        src={getProfileImageUrl(other.profileImageUrl)}
                        alt={other.name}
                        className="w-16 h-16 rounded-full mb-2 object-cover"
                      />
                      <p className="text-sm font-medium">{other.name}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ✅ Incoming PairUps */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Incoming PairUps</h2>
            {incoming.length === 0 ? (
              <p className="text-gray-400">No incoming PairUps.</p>
            ) : (
              <ul className="space-y-4">
                {incoming.map((req) => (
                  <li
                    key={req._id}
                    className="bg-[#1e1e1e] p-4 rounded-lg flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={getProfileImageUrl(req.from.profileImageUrl)}
                        alt={req.from.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">{req.from.name}</p>
                        <p className="text-sm text-gray-400">{req.from.bio}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptPairUp(req._id)}
                        className="px-3 py-1 bg-green-600 rounded hover:bg-green-700 text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectPairUp(req._id)}
                        className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ✅ Discover Developers */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Discover Developers</h2>

            <input
              type="text"
              value={developerSearch}
              onChange={(e) => setDeveloperSearch(e.target.value)}
              placeholder="Search developers..."
              className="mb-4 w-full p-2 rounded bg-[#1e1e1e] border border-gray-600 focus:outline-none"
            />

            {filteredDevelopers.length === 0 ? (
              <p className="text-gray-400">No developers found.</p>
            ) : (
              <ul className="space-y-4">
                {filteredDevelopers.map((dev) => (
                  <li
                    key={dev._id}
                    className="bg-[#1e1e1e] p-4 rounded-lg flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={getProfileImageUrl(dev.profileImageUrl)}
                        alt={dev.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">{dev.name}</p>
                        <p className="text-sm text-gray-400">{dev.bio}</p>
                      </div>
                    </div>
                    {dev.sent ? (
                      <button
                        onClick={() => withdrawPairUp(dev.pairUpId)}
                        className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-800 text-sm"
                      >
                        Withdraw
                      </button>
                    ) : (
                      <button
                        onClick={() => sendPairUp(dev._id)}
                        className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-sm"
                      >
                        PairUp
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
