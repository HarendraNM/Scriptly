import React from "react";
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-6">
        <div className="max-w-3xl bg-white shadow-2xl rounded-3xl p-10 text-center transform transition-all hover:scale-105 hover:shadow-3xl">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            About <span className="text-blue-600">Scriptly</span>
          </h1>
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            Scriptly is a powerful online code editor that allows users to create, edit, and manage
            coding projects in multiple programming languages. Whether you're a beginner or an experienced developer,
            Scriptly provides an intuitive and collaborative environment to streamline your coding workflow.
          </p>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Key Features</h2>
          <ul className="text-gray-700 text-lg space-y-3 mb-8">
            <li className="flex items-center justify-center space-x-2">
              <span className="text-blue-500">🚀</span>
              <span>Multi-language support (C, C++, Python, Java, JavaScript, etc.)</span>
            </li>
            <li className="flex items-center justify-center space-x-2">
              <span className="text-blue-500">💾</span>
              <span>Save and manage multiple projects</span>
            </li>
            <li className="flex items-center justify-center space-x-2">
              <span className="text-blue-500">🔒</span>
              <span>Secure user authentication</span>
            </li>
            <li className="flex items-center justify-center space-x-2">
              <span className="text-blue-500">🎨</span>
              <span>User-friendly interface with Monaco Editor</span>
            </li>
            <li className="flex items-center justify-center space-x-2">
              <span className="text-blue-500">🌍</span>
              <span>Cloud storage for easy access anywhere</span>
            </li>
          </ul>
          <p className="text-gray-500 text-sm mt-8 italic">Developed with ❤️ for developers.</p>
        </div>
      </div>
    </>
  );
};

export default About;