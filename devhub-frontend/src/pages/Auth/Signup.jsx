import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import image from "../../assets/devhub-auth.png";
import { motion } from "framer-motion";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    image: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("bio", form.bio);
      if (form.image) formData.append("image", form.image);

      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      localStorage.setItem("devhub_token", res.data.token);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0d0d0d] to-[#1a0000] text-white px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full flex flex-col md:flex-row items-center bg-[#141414] rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="hidden md:block md:w-1/2">
          <img src={image} alt="Signup Visual" className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center overflow-y-auto max-h-[90vh]">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-red-600 mb-2"
          >
            Create Account
          </motion.h2>
          <p className="text-gray-400 mb-6 text-center">Join DevHub and connect with other developers</p>

          {/* Profile Upload Circle */}
          <div className="flex flex-col items-center mb-6">
            <label htmlFor="image-upload" className="relative cursor-pointer group">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#1e1e1e] flex items-center justify-center border border-gray-600 overflow-hidden">
                {form.image ? (
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-red-600 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </label>
            <input
              id="image-upload"
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="hidden"
            />
            <p className="text-gray-400 text-sm mt-2">Upload your profile photo</p>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-[#1e1e1e] border border-gray-700 placeholder-gray-400"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-[#1e1e1e] border border-gray-700 placeholder-gray-400"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password (Min 8 Characters)"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 rounded-md bg-[#1e1e1e] border border-gray-700 placeholder-gray-400"
                required
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            <textarea
              name="bio"
              placeholder="Tell us about yourself..."
              value={form.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-md bg-[#1e1e1e] border border-gray-700 placeholder-gray-400 resize-none"
            ></textarea>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition rounded-md font-semibold"
            >
              Create Account
            </motion.button>
          </form>

          <div className="text-center text-gray-400 text-sm mt-4">or continue with</div>
          <div className="flex justify-center gap-4 mt-2">
            <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-200">
              <FaGoogle /> Google
            </button>
            <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700">
              <FaGithub /> GitHub
            </button>
          </div>

          <p className="text-sm text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-red-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
