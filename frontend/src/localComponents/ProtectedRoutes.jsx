import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore.js";
import axiosInstance from "../utils/axiosInstance.js";
import { toast } from "react-toastify";

const ProtectedRoutes = ({ children }) => {
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        await axiosInstance.get("/user/getme"); 
        setIsValid(true);
      } catch (error) {
        console.error("Session verification failed:", error);
        toast.error("Session expired, please login again.");
        logout();
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, [user, logout]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Checking session...
      </div>
    );
  }

  if (!user || !isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoutes;
