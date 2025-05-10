import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";
import { socket } from "../../../utils/socket";

// const socket = io("http://localhost:2020", {
//   transports: ["websocket", "polling"],
//   autoConnect: true,
//   withCredentials: true,
// });

function PatientChat() {
  const user = useSelector((state) => state.user.user);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [idAdmin, setIdAdmin] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const adminsResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL_SERVER}/user/admins`,
          { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
        );

        if (adminsResponse?.data?.data?.admins?.length > 0) {
          const adminId = adminsResponse.data.data.admins[0]._id;
          setIdAdmin(adminId);
          const conversationResponse = await axios.get(
            `${import.meta.env.VITE_BASE_URL_SERVER}/message/conversation/${
              user?._id
            }/${adminId}`,
            {
              headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` },
            }
          );
          setMessages(conversationResponse.data.data);

          const unread = conversationResponse.data.data.filter(
            (msg) => !msg.is_read && msg.sender._id !== user?._id
          ).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (Cookies.get("auth-token")) {
      fetchMessages();
    }
  }, [user?._id]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (
        (message.sender._id === user?._id &&
          message.receiver.role === "admin") ||
        (message.sender.role === "admin" && message.receiver._id === user?._id)
      ) {
        setMessages((prev) => [...prev, message]);

        if (!showChat && message.sender._id !== user?._id) {
          setUnreadCount((prev) => prev + 1);
        }
      }
    };

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("newMessage", handleNewMessage);
    };
  }, [user?._id, showChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      const adminsResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL_SERVER}/user/admins`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
      );

      if (adminsResponse.data.data.admins.length > 0) {
        const adminId = adminsResponse.data.data.admins[0]._id;
        const message = {
          sender: user._id,
          receiver: adminId,
          message: messageText,
        };

        socket.emit("sendMessage", message);
        setMessageText("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const toggleChat = async () => {
    setShowChat(!showChat);
    if (!showChat) {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL_SERVER}/message/readMessage`,
        {
          sender: idAdmin,
          receiver: user._id,
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
      );

      setUnreadCount(0);
    }
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {!showChat ? (
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={toggleChat}
        >
          <div
            className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
              isHovered ? "bg-green-100" : "bg-white"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-8 h-8 transition-all duration-300 ${
                isHovered ? "text-green-600 scale-110" : "text-gray-600"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>
          </div>

          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2">
              <span className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 text-white text-xs items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-[400px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleChat}
                className="text-white hover:text-blue-200 transition"
              >
                <IoMdClose size={20} />
              </button>
              <p className="text-white text-lg font-semibold">
                Prescripto Chat
              </p>
            </div>
            <div className="flex items-center gap-1">
              <span
                className={`h-2 w-2 rounded-full ${
                  isConnected ? "bg-green-400" : "bg-red-400"
                }`}
              ></span>
              <span className="text-white text-sm">
                {isConnected ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12 mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.sender._id === user?._id
                      ? "justify-end"
                      : "justify-start"
                  } mb-3`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                      msg.sender._id === user?._id
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 rounded-bl-none"
                    }`}
                  >
                    {msg.sender._id !== user?._id && (
                      <p className="font-semibold text-blue-600 mb-1">
                        {msg.sender.name}
                      </p>
                    )}
                    <p className="break-words">{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {Cookies.get("auth-token") && (
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-gray-200 bg-white flex gap-2"
            >
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                Send
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default PatientChat;
