import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";

const socket = io("http://localhost:2020", { autoConnect: true });

function AdminChat() {
  const user = useSelector((state) => state.user.user);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_SERVER}/user`,
          { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
        );
        setPatients(response.data.user);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    if (user.role === "admin") fetchPatients();
  }, [user?._id]);

  // جلب الرسائل عند تغيير المريض المحدد
  useEffect(() => {
    if (!selectedPatient) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_SERVER}/message/conversation/${
            user._id
          }/${selectedPatient}`,
          { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
        );
        setMessages(response.data.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedPatient, user?._id]);

  // الاستماع للرسائل الجديدة
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (
        (message.sender._id === selectedPatient &&
          message.receiver._id === user?._id) ||
        (message.sender._id === user?._id &&
          message.receiver._id === selectedPatient)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedPatient, user?._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedPatient) return;

    try {
      const message = {
        sender: user._id,
        receiver: selectedPatient,
        message: messageText,
      };

      socket.emit("sendMessage", message);
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select a patient</option>
          {patients.map((patient) => (
            <option key={patient._id} value={patient._id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>

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

      {selectedPatient && (
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
      )}
    </div>
  );
}

export default AdminChat;
