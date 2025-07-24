import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import Navbar from "../UI/Navbar";
import Footer from "../UI/Footer";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const nevigate=useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    bio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        formData
      );
      toast.success(response?.data?.message|| "user registered successfully. please login.");
      console.log(response);
      nevigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Registration failed! Please check your input."
      );
    }
  
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex items-center justify-center w-full h-full">
        <Card className="w-full max-w-sm backdrop-blur-xl bg-black/30 text-white">
          <CardHeader className="text-center text-2xl">
            <CardTitle>Register Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3 ">
                {/* Fullname */}
                <div className="grid gap-2">
                  <Label htmlFor="fullname">Username</Label>
                  <Input
                    id="fullname"
                    type="text"
                    name="username"
                    placeholder="John Doe"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="abcd@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Gender</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                        className="h-4 w-4"
                        required
                      />
                      Male
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                        className="h-4 w-4"
                        required
                      />
                      Female
                    </label>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Write something about yourself..."
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="rounded-md border border-gray-300 bg-black/20 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full border-1 border-gray-800 hover:cursor-pointer"
                >
                  Register
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
