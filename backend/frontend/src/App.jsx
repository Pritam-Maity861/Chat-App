import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoutes from "./localComponents/ProtectedRoutes";
import useAuthStore from "../store/useAuthStore";
import axiosInstance from "./utils/axiosInstance";
import UpdateProfile from "./pages/UpdateProfile";

const App = () => {
  const { logout, isLoggedIn } = useAuthStore();

  useEffect(() => {
    // Only check if we *think* we're logged in
    if (isLoggedIn) {
      const checkAuth = async () => {
        try {
          await axiosInstance.get("/user/getme"); 
        } catch (err) {
          logout();
          console.error("Session check failed:", err);
        }
      };
      checkAuth();
    }
  }, [isLoggedIn]);

  return (
    <div className="bg-[url('./assets/bg-image.jpg')] bg-cover ">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* protected route */}
        <Route
          path="/chatpage"
          element={
            <ProtectedRoutes>
              <ChatPage />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/update-profile"
          element={
            <ProtectedRoutes>
              <UpdateProfile />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
