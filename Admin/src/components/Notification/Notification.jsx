import React, { useState, useEffect } from "react";
import { IoMdNotifications } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import {
  FaCheck,
  FaTimes,
  FaCalendarCheck,
  FaCalendarTimes,
} from "react-icons/fa";
import { socket } from "../../Utils/socket";

function Notification() {
  const user = useSelector((state) => state.user.user);
  const [notifications, setNotifications] = useState([]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigator = useNavigate();

  useEffect(() => {
    if (!user?._id) {
      console.log("No user ID found, skipping socket registration");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL_SERVER
          }/notification/getNotification`,
          { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
        );
        setNotifications(response.data.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchData();

    socket.emit("register", user._id);

    socket.on("notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast.info(notification.message, { position: "top-center" });
    });

    socket.on("connect", () => {
      socket.emit("register", user._id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      socket.off("notification");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [user?._id]);

  useEffect(() => {
    const count = notifications.filter(
      (notification) => !notification.is_read
    ).length;
    setUnreadCount(count);
  }, [notifications]);

  const markAsRead = async (id, read, type) => {
    setNotifications(
      notifications.map((notification) =>
        notification._id === id
          ? { ...notification, is_read: true }
          : notification
      )
    );

    setShowNotifications(false);

    const targetPath =
      type === "new_appointment"
        ? "/admin/appointment"
        : type === "appointment_cancelled"
        ? "/admin/appointment-cancelled"
        : type === "appointment_completed"
        ? "/admin/appointment-completed"
        : "admin/user";

    if (targetPath) {
      setTimeout(() => {
        navigator(targetPath, { replace: true });
        location.reload();
      }, 200);
    }

    if (!read) {
      await axios.put(
        `${
          import.meta.env.VITE_BASE_URL_SERVER
        }/notification/read-notification/${id}`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
      );
    }
  };

  const markAllAsRead = () => {
    // setNotifications(
    //   notifications.map((notification) => ({
    //     ...notification,
    //     read: true,
    //   }))
    // );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment_completed":
        return <FaCalendarCheck className="text-green-500 text-lg" />;
      case "appointment_cancelled":
        return <FaCalendarTimes className="text-red-500 text-lg" />;
      case "new_appointment":
        return <FaCheck className="text-blue-500 text-lg" />;
      case "reminder":
        return <IoMdNotifications className="text-yellow-500 text-lg" />;
      default:
        return <IoMdNotifications className="text-gray-500 text-lg" />;
    }
  };

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <IoMdNotifications size={"25px"} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute top-12 right-0 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              Mark all as read
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications available
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.is_read ? "bg-blue-50" : ""
                  }`}
                  onClick={() =>
                    markAsRead(
                      notification._id,
                      notification.is_read,
                      notification.type
                    )
                  }
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {notification.message}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                        {!notification.is_read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-gray-200 text-center">
            <button className="text-sm text-blue-500 hover:text-blue-700">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;
