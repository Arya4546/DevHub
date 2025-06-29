import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { FaGoogle, FaGithub, FaEnvelope, FaLock } from "react-icons/fa";
import image from "../../assets/devhub-auth.png";
import { motion } from "framer-motion";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, form);
      localStorage.setItem("devhub_token", res.data.token);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0d0d0d] to-[#1a0000] text-white px-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="max-w-5xl w-full flex flex-col md:flex-row items-center bg-[#141414] rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="hidden md:block md:w-1/2">
          <img src={image} alt="Login Visual" className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-red-600"
          >
            Welcome Back
          </motion.h2>
          <p className="text-gray-400">Log in to your DevHub account</p>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-md bg-[#1e1e1e] border border-gray-700 placeholder-gray-400"
                required
              />
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3 rounded-md bg-[#1e1e1e] border border-gray-700 placeholder-gray-400"
                required
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition rounded-md font-semibold"
            >
              Log In
            </motion.button>
          </form>

          <div className="text-center text-gray-400 text-sm">or continue with</div>
          <div className="flex justify-center gap-4">
            <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-200">
              <FaGoogle /> Google
            </button>
            <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700">
              <FaGithub /> GitHub
            </button>
          </div>

          <p className="text-sm text-center text-gray-400 mt-4">
            New to DevHub? <Link to="/signup" className="text-red-400 hover:underline">Create account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
