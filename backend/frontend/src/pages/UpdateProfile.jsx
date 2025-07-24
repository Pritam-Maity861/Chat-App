import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import Navbar from "../UI/Navbar";
import Footer from "../UI/Footer";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("bio", formData.bio);
      if (avatar) {
        data.append("avatar", avatar);
      }

      const res = await axiosInstance.put("/user/updateProfile", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      updateUser(res.data.data);

      toast.success("Profile updated successfully!");
      navigate("/chatpage");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message || "Failed to update profile. Try again."
      );
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="h-full  bg-black/35 backdrop-blur-xl flex  items-center justify-center px-4">
        <div className=" bg-black/35 backdrop-blur-xl text-gray-400 rounded-lg shadow-md p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center text-purple-700">
            Update Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300  font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter new username"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter new email"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Write something about yourself..."
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">
                Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
              {user?.avatar && (
                <div className="mt-2">
                  <p className="text-sm text-gray-300 mb-1">Current Avatar:</p>
                  <img
                    src={user.avatar}
                    alt="Current Avatar"
                    className="h-16 w-16 rounded-full object-cover border"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md text-white font-medium bg-purple-600 hover:bg-purple-700"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateProfile;
