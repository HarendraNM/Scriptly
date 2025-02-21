import React, { useState } from 'react';
import logo from '../images/logo.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!fullname || !email || !password || !confirmpassword) {
      toast.warn("Please fill out all fields.", { position: "top-center" });
      return;
    }

    if (password !== confirmpassword) {
      toast.error("Passwords do not match. Please try again.", { position: "top-center" });
      return;
    }

    try {
      const response = await axios.post(`${api_base_url}/signup`, {
        fullname,
        email,
        password,
      });

      if (response.status === 201) {
        toast.success("Signup successful!", { position: "top-center" });
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error || "Signup failed.", { position: "top-center" });
      } else {
        toast.error("Something went wrong. Please try again later.", { position: "top-center" });
      }
    }
  };

  return (
    <div className="con flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <form
        onSubmit={onSubmit}
        className="h-auto max-w-md w-full p-8 flex flex-col items-center bg-gray-900 rounded-2xl shadow-xl shadow-black/50"
      >
        <img className="w-[180px] object-cover py-4" src={logo} alt="Scriptly Logo" />

        <div className="w-full mb-4">
          <input
            onChange={(e) => setFullname(e.target.value)}
            value={fullname}
            className="w-full px-4 py-3 text-sm bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Full Name"
            required
          />
        </div>
        <div className="w-full mb-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full px-4 py-3 text-sm bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="Email Address"
            required
          />
        </div>
        <div className="w-full mb-4">
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="w-full px-4 py-3 text-sm bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <div className="w-full mb-4">
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmpassword}
            className="w-full px-4 py-3 text-sm bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Confirm Password"
            required
          />
        </div>

        <p className="text-sm text-gray-400 mt-2 self-start">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
        <button className="mt-3 w-full py-3 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition duration-200 hover:cursor-pointer">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
