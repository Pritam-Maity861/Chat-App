import React from "react";
import Navbar from "../UI/Navbar";
import { Button } from '@/components/ui/button'
import Footer from "../UI/Footer";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

const LandingPage = () => {
  const {isLoggedIn}=useAuthStore();
  return (
    <div className="text-gray-200 text-3xl h-screen flex flex-col text-center ">
      <Navbar />
      <div className="flex  items-center justify-center  h-full ">
        <div className="flex flex-col justify-center items-center gap-4 p-20 rounded-2xl backdrop-blur-3xl shadow-2xl">
          <p className="text-4xl">Welcome to Our chat Application</p>
          <p className="text-2xl">make your chat secret</p>
          
          <Link to={isLoggedIn?"/chatpage":"/login"} variant="" className="border-gray-400 rounded w-40 text-xl h-15 bg-gray-800 hover:cursor-pointer p-3">Let's Go</Link>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default LandingPage;
