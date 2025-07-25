// components/Navbar.jsx
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import useAuthStore from "../../store/useAuthStore";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logOut", {}, { withCredentials: true });
      logout();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out. Try again.");
    }
  };

  return (
    <header className="w-full border-b border-gray-600 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center bg-black/35 backdrop-blur-xl justify-between">
        <div className="text-2xl font-bold text-white">
          <Link to="/">Golpo Gujob</Link>
        </div>

        <nav className="hidden md:flex gap-4 items-center">
          {!isLoggedIn ? (
            <>
              <Button asChild>
                <Link
                  to="/login"
                  className="bg-violet-600 text-white hover:cursor-pointer"
                >
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link
                  to="/register"
                  className="bg-purple-800 text-white hover:cursor-pointer"
                >
                  Register
                </Link>
              </Button>
            </>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full bg-white/20 p-1 hover:bg-white/30"
                >
                  <img
                    src={user?.avatar || "https://via.placeholder.com/40"}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-black/30 backdrop-blur-xl text-white"
              >
                <div className="mt-10 flex flex-col gap-4">
                  <div className="text-2xl font-bold text-white text-center">
                    Golpo Gujob
                  </div>
                  {!isLoggedIn ? (
                    <>
                      <Button asChild>
                        <Link
                          to="/login"
                          className="w-full bg-blue-400 text-white hover:cursor-pointer"
                        >
                          Login
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link
                          to="/register"
                          className="w-full bg-purple-800 text-white hover:cursor-pointer"
                        >
                          Register
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <img
                            src={
                              user?.avatar || "https://via.placeholder.com/80"
                            }
                            alt="Profile"
                            className="h-16 w-16 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
                          />
                        </DialogTrigger>
                        <DialogContent className="p-4 bg-black/80 backdrop-blur-xl border-none flex flex-col items-center justify-center">
                          <img
                            src={
                              user?.avatar || "https://via.placeholder.com/300"
                            }
                            alt="Profile Large"
                            className="max-h-[80vh] max-w-full rounded-lg object-contain"
                          />
                        </DialogContent>
                      </Dialog>

                      <p className="text-2xl">{user.username}</p>
                      <p>{user.email}</p>
                      <Button
                        onClick={() => navigate("/update-profile")}
                        className="w-full bg-blue-400 hover:cursor-pointer"
                      >
                        Edit Profile
                      </Button>
                      <Button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:cursor-pointer"
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="bg-purple-950 text-white hover:cursor-pointer"
                size="icon"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-black/30 backdrop-blur-xl text-white"
            >
              <div className="mt-10 flex flex-col gap-4">
                <div className="text-2xl font-bold text-white text-center">
                  Golpo Gujob
                </div>
                {!isLoggedIn ? (
                  <>
                    <Button asChild>
                      <Link
                        to="/login"
                        className="w-full bg-blue-400 text-white hover:cursor-pointer"
                      >
                        Login
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link
                        to="/register"
                        className="w-full bg-purple-800 text-white hover:cursor-pointer"
                      >
                        Register
                      </Link>
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <img
                          src={user?.avatar || "https://via.placeholder.com/80"}
                          alt="Profile"
                          className="h-16 w-16 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
                        />
                      </DialogTrigger>
                      <DialogContent className="p-4 bg-black/80 backdrop-blur-xl border-none flex flex-col items-center justify-center">
                        <img
                          src={
                            user?.avatar || "https://via.placeholder.com/300"
                          }
                          alt="Profile Large"
                          className="max-h-[80vh] max-w-full rounded-lg object-contain"
                        />
                      </DialogContent>
                    </Dialog>

                    <p className="text-2xl">{user.username}</p>
                    <p>{user.email}</p>
                    <Button
                      onClick={() => navigate("/update-profile")}
                      className="w-full bg-blue-400 hover:cursor-pointer"
                    >
                      Edit Profile
                    </Button>
                    <Button
                      onClick={handleLogout}
                      className="w-full bg-red-500 hover:cursor-pointer"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
