import React from "react";
import Navbar from "../components/Navbar";

const Contact = () => {
  return (
    <>
        <Navbar/>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact the Creator</h1>
                <p className="text-gray-600 mb-6">Have questions or suggestions? Feel free to reach out!</p>
                
                <div className="text-left">
                <p className="text-lg font-semibold text-gray-700">Creator: <span className="font-normal">Harendra Nath Mahto</span></p>
                <p className="text-lg font-semibold text-gray-700">Email: harendramahto001@gmail.com</p>
                <p className="text-lg font-semibold text-gray-700">GitHub: <a href="https://github.com/HarendraNM" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://github.com/HarendraNM</a></p>
                <p className="text-lg font-semibold text-gray-700">LinkedIn: <a href="https://www.linkedin.com/in/harendra-nath-mahto-76a58a25b/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://www.linkedin.com/in/harendra-nath-mahto-76a58a25b/</a></p>
                </div>
            </div>
        </div>
    </>
  );
};

export default Contact;
