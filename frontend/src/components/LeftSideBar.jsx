import React from "react";
import { Link } from "react-router-dom";
import { IoLogoHackernews } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LeftSideBar = () => {
  const queryClient = useQueryClient();

  // Fetch authenticated user
  const { data: authData } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
  });

  // Logout mutation
  const { mutate: logout, isPending: isLogoutPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Logout failed");
      }
    },
    onSuccess: () => {
      toast.success("Logout successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  return (
    <div className="ml-20 mt-5">
      {/* Navigation Links */}
      <div>
        <Link to="/">
          <div className="flex gap-2 mb-6 mt-2 items-center">
            <IoLogoHackernews />
          </div>

          <div className="flex gap-2 items-center hover:bg-red-300 duration-150 px-2 rounded-2xl">
            <IoHome />
            <div>Home</div>
          </div>
        </Link>

        <Link to="/notifications">
          <div className="flex gap-2 items-center hover:bg-red-300 duration-150 px-2 rounded-2xl">
            <IoIosNotifications />
            <div>Notifications</div>
          </div>
        </Link>

        {authData?.username && (
          <Link to={`/profile/${authData.username}`}>
            <div className="flex gap-2 items-center hover:bg-red-300 duration-150 px-2 rounded-2xl">
              <MdAccountCircle />
              <div>Profile</div>
            </div>
          </Link>
        )}
      </div>

      {/* Logout & Profile Section */}
      <div>
        <button
          className="flex items-center gap-2 mt-80 cursor-pointer hover:bg-red-300 duration-150 px-2 rounded-2xl"
          onClick={(e) => {
            e.preventDefault();
            logout();
          }}
        >
          <div className="flex items-center gap-2 text-[10px]">
            <img
              src={authData?.profileImg || "vite.svg"}
              alt="Profile"
              className="w-6 h-6 rounded-full"
            />
            <div>
              <div className="font-semibold">
                {authData?.fullName || "Loading..."}
              </div>
              <div>@{authData?.username || "..."}</div>
            </div>
          </div>
          <BiLogOut />
        </button>
      </div>
    </div>
  );
};

export default LeftSideBar;
