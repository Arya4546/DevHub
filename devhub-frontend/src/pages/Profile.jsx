import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  Loader2,
  Github,
  Mail,
  BadgeCheck,
  Wrench,
  Lock,
  Edit,
  UploadCloud,
  Trash2,
  Save,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    githubUrl: "",
    techStack: "",
    role: "",
  });

  const token = localStorage.getItem("devhub_token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { user, pairUpsCount } = res.data;

      setProfile({ ...user, pairUpsCount });

      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        githubUrl: user.githubUrl || "",
        techStack: user.techStack?.join(", ") || "",
        role: user.role || "",
      });
    } catch (err) {
      console.error("Profile fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setUpdating(true);
    try {
      await axios.put(
        `${API_BASE_URL}/api/users/me`,
        {
          name: formData.name,
          email: formData.email,
          bio: formData.bio,
          githubUrl: formData.githubUrl,
          techStack: formData.techStack.split(",").map((s) => s.trim()),
          role: formData.role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      await axios.post(`${API_BASE_URL}/api/users/me/profile-image`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProfile();
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const handleRemoveImage = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/users/me/profile-image`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProfile();
    } catch (err) {
      console.error("Remove image failed:", err);
    }
  };

  const handleChangePassword = async () => {
    setChangingPassword(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/users/me/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert("Password change failed");
      console.error(err);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-black via-[#0d0d0d] to-[#1a0000] text-white">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto">
        <Navbar />
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-red-600 mb-6">My Profile</h1>

          <div className="bg-[#1e1e1e] p-6 rounded-lg flex flex-col md:flex-row items-start gap-8 min-h-[600px]">
            <div className="flex flex-col items-center gap-4">
              <img
                src={
                  profile.profileImageUrl
                    ? `${API_BASE_URL}${profile.profileImageUrl}`
                    : "/default-avatar.png"
                }
                alt={profile.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-red-600"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 rounded hover:bg-blue-700"
                >
                  <UploadCloud className="w-4 h-4" /> Change Image
                </button>
                <button
                  onClick={handleRemoveImage}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-700 rounded hover:bg-gray-800"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  hidden
                />
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
              {[
                ["Name", formData.name, "name"],
                ["Email", formData.email, "email"],
                ["Bio", formData.bio, "bio"],
                ["GitHub", formData.githubUrl, "githubUrl"],
                ["Tech Stack", formData.techStack, "techStack"],
                ["Role", formData.role, "role"],
                ["Pair Ups", profile.pairUpsCount, ""],
              ].map(([label, value, key]) => (
                <div key={label}>
                  <label className="block text-sm mb-1">{label}</label>
                  {isEditing && key ? (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-[#141414] border border-gray-700 rounded"
                    />
                  ) : (
                    <p className="bg-[#141414] px-4 py-2 rounded">{value || "-"}</p>
                  )}
                </div>
              ))}

              <div className="flex gap-4 mt-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                ) : (
                  <button
                    onClick={handleProfileUpdate}
                    disabled={updating}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />{" "}
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                )}
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h2 className="text-lg mb-2 flex items-center gap-2">
                  <Lock className="w-5 h-5" /> Change Password
                </h2>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full mb-2 px-4 py-2 bg-[#141414] border border-gray-700 rounded"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mb-2 px-4 py-2 bg-[#141414] border border-gray-700 rounded"
                />
                <button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                  {changingPassword ? "Changing..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
