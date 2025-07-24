import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import axiosInstance from "../utils/axiosInstance.js"


const Login = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form Data Submitted:", formData);
    try {
      const response = await axiosInstance.post("/user/login",formData)
      // console.log(response)
      const { user,token } = response.data.data;
      // console.log(user,token);
      setAuth(user, token);

      toast.success(response?.data?.message||"Login successful! Welcome back 👋");
      navigate("/chatpage");
    } catch (error) {
      console.log("erroe while login:", error);
      const errmsg =
        error.response?.data?.message ||
        "Login failed! Please check your credentials.";
      toast.error(errmsg);
      setFormData({ email: "", password: "" });
    }
  };

  return (
    <div className=" h-screen flex flex-col  ">
      <Navbar />
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-sm backdrop-blur-xl bg-black/30 text-white ">
          <CardHeader className="text-center text-2xl">
            <CardTitle>Login Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
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
                <Button
                  type="submit"
                  className="w-full border-1 border-gray-800"
                >
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <p>
              have not any account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
