import React, { useEffect, useState } from "react";
import Navbar from "../UI/Navbar";
import Footer from "../UI/Footer";
import axiosInstance from "../utils/axiosInstance";
import { io } from "socket.io-client";
import useAuthStore from "../../store/useAuthStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { MdSend } from "react-icons/md";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

const socket = io("http://localhost:8000", { withCredentials: true });

const ChatPage = () => {
  const { user } = useAuthStore();
  const [otherUser, setOtherUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const [onlineUserIds, setOnlineUserIds] = useState([]);

  useEffect(() => {
    socket.on("onlineUsers", (userIds) => {
      setOnlineUserIds(userIds);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  //function for search filter....
  const filteredUsers = otherUser.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //fetch all other user except logged in user...
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/user/otherUsers");
        setOtherUser(res.data.data);
      } catch (err) {
        console.error("Error while fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // socket.io-client setgroups....
  useEffect(() => {
    if (user?._id) {
      socket.emit("register", user._id);
    }
  }, [user]);

  useEffect(() => {
    const handleNewMessage = (msg) => {
      if (
        (msg.senderId === selectedUser?._id && msg.reciverId === user?._id) ||
        (msg.senderId === user?._id && msg.reciverId === selectedUser?._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedUser, user]);

  //fetch all messages from backend ...
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const res = await axiosInstance.get(
          `/message/getMessage/${selectedUser._id}`
        );
        setMessages(res.data.data?.mesages || []);
      } catch (err) {
        console.error("Error while fetching messages:", err);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  //handel message send ....
  const handleSend = async () => {
    if (!selectedUser || !newMessage.trim()) return;
    try {
      const res = await axiosInstance.post(
        `/message/sendMessage/${selectedUser._id}`,
        {
          message: newMessage,
        }
      );
      setMessages((prev) => [...prev, res.data.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  //sidebar ..
  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-600 shrink-0">
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search chat..."
          className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((u) => (
          <div
            key={u._id}
            onClick={() => setSelectedUser(u)}
            className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-700 ${
              selectedUser?._id === u._id ? "bg-gray-900" : ""
            }`}
          >
            <div className="relative">
              <img
                src={u.avatar || "https://via.placeholder.com/40"}
                alt={u.username}
                className="h-10 w-10 rounded-full object-cover"
              />
              {onlineUserIds.includes(u._id) && (
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-black rounded-full"></span>
              )}
            </div>
            <span className="font-medium text-xl text-gray-300">
              {u.username.charAt(0).toUpperCase() +
                u.username.slice(1).toLowerCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex min-h-0 backdrop-blur-xl bg-black/30 text-white">
        {/* ===== Desktop Sidebar ===== */}
        <div className="hidden md:flex w-2/5 border-r border-gray-600 flex-col min-h-0">
          {SidebarContent}
        </div>

        {/* ===== Chat Container ===== */}
        <div className="w-full md:w-3/5 flex flex-col min-h-0">
          {/* Top bar with menu button on mobile */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-600 shrink-0">
            {/* Show menu button only on mobile */}
            <div className="md:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="bg-black/80 backdrop-blur-xl text-white w-screen max-w-full p-0 flex flex-col h-full"
                >
                  <SheetHeader className="shrink-0 p-4 border-b border-gray-600">
                    <SheetTitle className="text-2xl text-center text-gray-300">
                      Golpo Gujob
                    </SheetTitle>
                  </SheetHeader>

                  {/* Scrollable area for users */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 border-b border-gray-600">
                      <input
                        type="text"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search chat..."
                        className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      {filteredUsers.map((u) => (
                        <div
                          key={u._id}
                          onClick={() => {
                            setSelectedUser(u);
                            setOpen(false);
                            setSearchTerm("");
                          }}
                          className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-700 ${
                            selectedUser?._id === u._id ? "bg-gray-900" : ""
                          }`}
                        >
                          <div className="relative">
                            <img
                              src={u.avatar || "https://via.placeholder.com/40"}
                              alt={u.username}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            {onlineUserIds.includes(u._id) && (
                              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-black rounded-full"></span>
                            )}
                          </div>

                          <span className="font-medium text-xl text-gray-300">
                            {u.username.charAt(0).toUpperCase() +
                              u.username.slice(1).toLowerCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {selectedUser && (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <img
                      src={
                        selectedUser?.avatar || "https://via.placeholder.com/80"
                      }
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
                    />
                  </DialogTrigger>
                  <DialogContent className="p-4 bg-black/80 backdrop-blur-xl border-none flex flex-col items-center justify-center">
                    <img
                      src={
                        selectedUser?.avatar ||
                        "https://via.placeholder.com/300"
                      }
                      alt="Profile Large"
                      className="max-h-[80vh] max-w-full rounded-lg object-contain"
                    />
                  </DialogContent>
                </Dialog>

                <h2 className="text-lg font-semibold">
                  {selectedUser.username}
                </h2>
              </>
            )}
          </div>

          {/* Messages */}
          {selectedUser ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const formattedDateTime = new Date(
                  msg.createdAt
                ).toLocaleString("en-IN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                return (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.senderId === user?._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className="flex flex-col">
                      <div
                        className={`px-4 py-2 rounded-lg max-w-xs ${
                          msg.senderId === user?._id
                            ? "bg-purple-600 text-white rounded-br-none"
                            : "bg-gray-300 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        {msg.message}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 self-end">
                        {formattedDateTime}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-2xl text-gray-400">
              No chat selected
            </div>
          )}

          {/* Input */}
          {selectedUser ? (
            <div className="p-4 border-t border-gray-600 flex gap-3 shrink-0">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSend}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                <MdSend />
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChatPage;
