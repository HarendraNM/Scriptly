import React from "react";
import logo from "../images/logo.png";
import { Link, useNavigate } from "react-router";

const Navbar = () => {
  return (
    <>
      <div className="nav px-[100px] flex items-center justify-between h-[90px] bg-gray-900">
        <img src={logo} alt="" className="w-[170px] object-cover" />
        <div className="flex items-center gap-[15px] text-white">
          <Link className="transition-all hover:text-blue-500" to="/">
            Home
          </Link>
          <Link className="transition-all hover:text-blue-500" to="/about">
            About
          </Link>
          {/* <Link className='transition-all hover:text-blue-500' to="/services">Services</Link> */}
          <Link className="transition-all hover:text-blue-500" to="/contact">
            Contact
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("isLoggedIn");
              window.location.reload();
            }}
            className="bg-red-500 transition-all hover:bg-red-600 px-[20px] py-[10px] rounded"
          >
            LogOut
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
