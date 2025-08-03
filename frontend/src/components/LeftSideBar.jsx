import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoLogoHackernews } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { CiMenuBurger } from "react-icons/ci";
import { BiLogOut } from "react-icons/bi";
import { LuSquareMenu } from "react-icons/lu";
import { FaLinkedin } from "react-icons/fa";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";

const LeftSideBar = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [toggleMenu, setToggleMenu] = useState(false);

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
      navigate("/api/login");
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
  const handleBurgerMenu = () => {
    setToggleMenu((prev) => !prev);
  };

  return (
    <div className="bg-gradient-to-r rounded from-red-300 via-pink-200 to-pink-400 py-3 sm:from-red-200 sm:justify-start  md:bg-gradient-to-r md:from-red-200 md:via-0% md:to-red-200 md:pr-4 flex md:justify-center pl-6 sm:pl-0 ">
      <div className=" top-4 text-red-500">
        <IoLogoHackernews className="sm:hidden" />
      </div>
      <button
        className=" bg-pink-500 p-1 rounded right-6 top-3 z-200 fixed sm:hidden transition-transform active:scale-150 duration-150"
        onClick={handleBurgerMenu}
      >
        <LuSquareMenu size={11} />
      </button>
      {/*Desktop Menu */}
      <div className="ml-20 hidden sm:block ">
        {/* Navigation Links */}
        <div>
          <Link to="/">
            <div className="flex gap-2 mb-6 text-red-500  items-center">
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
        <div>
          <a
            className="flex justify-start gap-2 hover:bg-red-300 rounded-2xl px-2 items-center"
            href="https://www.linkedin.com/in/zahid-sher-khan-593412223"
          >
            <div>
              <FaLinkedin />
            </div>
            Developer LinkedIn
          </a>
        </div>
        {/* Logout & Profile Section */}
        <div>
          <button
            className="flex items-center gap-2 mt-8 md:mt-80  cursor-pointer hover:bg-red-300 duration-150 px-2 rounded-2xl"
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            <div className="flex items-center gap-2 text-[10px]">
              <img
                src={authData?.profileImg || "avatar1.svg"}
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
      {/* Mobile Toggle Menu */}

      <div
        className={`fixed  right-7 top-9 z-50 w-44 sm:hidden rounded-2xl px-3 py-5 bg-gradient-to-br from-red-500 to-pink-400 duration-500 transition-transform ${
          toggleMenu
            ? "translate-x-0"
            : "-translate-x-[400%] translate-y-[200%]"
        }`}
      >
        {/* Navigation Links */}

        <div>
          <Link to="/">
            <div className="flex gap-2 mb-6 text-red-500  items-center">
              <IoLogoHackernews className="bg-pink-300 p-[1px] rounded " />
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
          <div>
            <a
              className="flex justify-start gap-2 hover:bg-red-300 rounded-2xl px-2 items-center"
              href="https://www.linkedin.com/in/zahid-sher-khan-593412223"
            >
              <div>
                <FaLinkedin />
              </div>
              Developer LinkedIn
            </a>
          </div>
        </div>

        {/* Logout & Profile Section */}
        <div>
          <button
            className="flex items-center gap-2 mt-8 md:mt-80  cursor-pointer hover:bg-red-300 duration-150 px-2 rounded-2xl"
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            <div className="flex items-center gap-2 text-[10px]">
              <img
                src={authData?.profileImg || "/avatar1.svg"}
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
    </div>
  );
};

export default LeftSideBar;
