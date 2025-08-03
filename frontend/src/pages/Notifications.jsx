import React, { useState, useEffect, useRef } from "react";
import LeftSideBar from "../components/LeftSideBar";
import RightSideBar from "../components/RightSideBar";
import { CiSettings } from "react-icons/ci";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Notifications = () => {
  const [dropDownMenu, setdropDownMenu] = useState(false);
  const timeoutRef = useRef(null);
  const queryClient = useQueryClient();
  const dropDownMenuRef = useRef(null);

  const handleSetting = () => {
    setdropDownMenu((prev) => !prev);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setdropDownMenu(false);
    }, 4000);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropDownMenuRef.current &&
        !dropDownMenuRef.current.contains(event.target)
      ) {
        setdropDownMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteAll = () => {
    const confirmed = window.confirm(
      "⚠️ Are you sure you want to delete ALL notifications? 😬"
    );
    if (confirmed) {
      deleteMutation();
    } else {
      toast("😅 Whew! Nothing was deleted.");
    }
  };

  const {
    data: notificationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notificationsData"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong 🧨");
      return data;
    },
  });

  const { mutate: deleteMutation, isLoading: deleteisLoading } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Oops, can't delete 🥲");
      return data;
    },
    onSuccess: () => {
      toast.success("🧹 All notifications cleared!");
      queryClient.invalidateQueries({ queryKey: ["notificationsData"] });
    },
    onError: () => {
      toast.error("🚫 Could not delete notifications!");
    },
  });

  const renderNotificationText = (notification) => {
    switch (notification.type) {
      case "follow":
        return "👣 followed you";
      case "like":
        return "❤️ liked your post";
      case "comment":
        return "💬 commented on your post";
      default:
        return "🔔 did something";
    }
  };

  return (
    <div className="flex justify-around w-full items-center mt-4">
      <div className="px-4 py-6 w-2/3 border-l border-r border-gray-500 mr-4">
        <div className="mb-8 pb-4">
          {/* Top Header */}
          <div className="flex justify-between items-center mb-12">
            <button className="cursor-pointer hover:text-red-500 font-semibold text-lg">
              📬 Notifications
            </button>
            <div className="relative">
              <button
                className="cursor-pointer hover:text-red-500"
                onClick={handleSetting}
              >
                <CiSettings />
              </button>

              {dropDownMenu && (
                <div
                  ref={dropDownMenuRef}
                  className="bg-red-300 rounded w-40 px-2 py-2 absolute right-0 text-xs hover:text-red-600 cursor-pointer border shadow-md"
                  onClick={handleDeleteAll}
                >
                  🗑️ Delete all notifications
                </div>
              )}
            </div>
          </div>

          <hr className="my-4 border-gray-500" />

          {/* Notifications List */}
          <div className="max-h-[80vh] scroll-hidden overflow-y-auto px-4">
            {isLoading ? (
              <div>⏳ Loading notifications...</div>
            ) : error ? (
              <div>🚨 Error loading notifications!</div>
            ) : notificationsData?.length === 0 ? (
              <div>😢 No notifications... So quiet here.</div>
            ) : (
              notificationsData.map((notification, index) => (
                <React.Fragment key={notification._id || index}>
                  <div className="flex items-center gap-2">
                    <img
                      src={notification.from?.profileImg || "avatar2.svg"}
                      className="w-5 h-5 rounded-full"
                      alt="User avatar"
                    />
                    <div className="text-sm">
                      @{notification.from?.username}{" "}
                      {renderNotificationText(notification)}
                    </div>
                  </div>
                  <hr className="my-4 border-gray-500" />
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
