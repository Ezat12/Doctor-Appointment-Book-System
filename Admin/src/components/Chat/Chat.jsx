import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";
import img_blank from "../../assets/image-myprofile.png";
import { socket } from "../../Utils/socket";

function AdminChat() {
  const user = useSelector((state) => state.user.user);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [unreadAll, setUnreadAll] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showPatientsList, setShowPatientsList] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL_SERVER
          }/message/getAllConversationToAdmin`,
          { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
        );

        setPatients(response.data.data);

        let countUnread = 0;
        response.data.data.forEach((patient) => {
          countUnread += patient.notRead;
        });
        setUnreadAll(countUnread);

        const counts = {};
        response.data.data.forEach((patient) => {
          counts[patient.user._id] = patient.notRead;
        });
        setUnreadCounts(counts);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    if (user.role === "admin") fetchPatients();
  }, [user?._id]);

  useEffect(() => {
    if (!selectedPatient) return;

    const fetchMessages = async () => {
      try {
        setLoadingPatient(selectedPatient._id);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_SERVER}/message/conversation/${
            user._id
          }/${selectedPatient._id}`,
          { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
        );
        setMessages(response.data.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingPatient(null);
      }
    };

    fetchMessages();
  }, [selectedPatient, user?._id]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      const senderId = message.sender._id;

      // أضف المريض إلى القائمة لو مش موجود
      if (
        senderId !== user?._id &&
        !patients.some((p) => p.user._id === senderId)
      ) {
        const newPatient = {
          user: {
            _id: senderId,
            name: message.sender.name || "Unknown User",
            profileImage: message.sender.profileImage || img_blank,
          },
          notRead: 0,
        };
        setPatients((prev) => [...prev, newPatient]);
      }

      // إذا كانت المحادثة المفتوحة هي مع نفس المستخدم، أضف الرسالة
      if (
        selectedPatient &&
        (senderId === selectedPatient._id ||
          message.receiver._id === selectedPatient._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }

      // تحديث عداد الرسائل غير المقروءة دائماً إذا لم تكن من الأدمن
      if (senderId !== user?._id) {
        setUnreadCounts((prev) => {
          const updated = {
            ...prev,
            [senderId]: (prev[senderId] || 0) + 1,
          };
          setUnreadAll(Object.values(updated).reduce((a, b) => a + b, 0));
          return updated;
        });
      }
    };

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedPatient, user?._id, patients]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedPatient) return;

    try {
      const message = {
        sender: user._id,
        receiver: selectedPatient._id,
        message: messageText,
      };

      socket.emit("sendMessage", message);
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const togglePatientsList = () => {
    setShowPatientsList(!showPatientsList);
  };

  const selectPatient = async (patient) => {
    setSelectedPatient(patient.user);
    setShowChat(true);
    setShowPatientsList(false);

    // تصفير عدد الرسائل الغير مقروءة لهذا المريض
    setUnreadCounts((prev) => ({
      ...prev,
      [patient.user._id]: 0,
    }));

    const newTotal = Object.entries(unreadCounts).reduce(
      (total, [id, count]) => {
        if (id === patient.user._id) return total;
        return total + count;
      },
      0
    );
    setUnreadAll(newTotal);

    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL_SERVER}/message/readMessage`,
        {
          sender: patient.user._id,
          receiver: user._id,
        },
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div className="flex flex-col items-end gap-3">
        {showPatientsList && (
          <div className="flex flex-col gap-3 w-[250px] max-h-[400px] overflow-y-auto bg-white rounded-lg shadow-lg p-2">
            {patients.map((patient, index) => (
              <div
                key={index}
                className="relative flex items-center gap-3 justify-between bg-blue-50 hover:bg-blue-100 cursor-pointer px-4 py-2 rounded-lg transition-colors"
                onClick={() => selectPatient(patient)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={patient.user.profileImage || img_blank}
                      alt={patient.user.name}
                    />
                  </div>
                  <span className="font-medium">{patient.user.name}</span>
                </div>
                {loadingPatient === patient.user._id ? (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  unreadCounts[patient.user._id] > 0 && (
                    <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
                      {unreadCounts[patient.user._id] > 9
                        ? "9+"
                        : unreadCounts[patient.user._id]}
                    </span>
                  )
                )}
              </div>
            ))}
          </div>
        )}

        {!showChat && (
          <div className="relative">
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={togglePatientsList}
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

              {unreadAll > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadAll > 9 ? "9+" : unreadAll}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {showChat && (
        <div className="w-[400px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-blue-600 p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowChat(false)}
                className="text-white hover:text-blue-200 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {selectedPatient && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={selectedPatient.profileImage || img_blank}
                      alt={selectedPatient.name}
                    />
                  </div>
                  <p className="text-white font-semibold">
                    {selectedPatient.name}
                  </p>
                </div>
              )}
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

          {selectedPatient && (
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

export default AdminChat;
