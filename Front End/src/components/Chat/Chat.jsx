import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";

const socket = io("http://localhost:2020", {
  transports: ["websocket", "polling"],
  autoConnect: true,
  withCredentials: true,
});

function PatientChat() {
  const user = useSelector((state) => state.user.user);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const adminsResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL_SERVER}/user/admins`,
          { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
        );

        console.log(adminsResponse.data.data);

        if (adminsResponse?.data.data?.admins?.length > 0) {
          const adminId = adminsResponse.data.data.admins[0]._id;
          const conversationResponse = await axios.get(
            `${import.meta.env.VITE_BASE_URL_SERVER}/message/conversation/${
              user?._id
            }/${adminId}`,
            {
              headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` },
            }
          );
          console.log(conversationResponse.data);
          setMessages(conversationResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [user?._id]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (
        (message.sender._id === user?._id &&
          message.receiver.role === "admin") ||
        (message.sender.role === "admin" && message.receiver._id === user?._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [user?._id]);

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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="h-[400px] overflow-y-auto border border-gray-300 rounded-lg p-4 mb-4 bg-white">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.sender._id === user?._id ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.sender._id === user?._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              <p>{msg.message}</p>
              <p className="text-xs opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default PatientChat;
