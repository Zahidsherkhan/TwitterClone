import React from "react";
import { Link } from "react-router-dom";
import { IoLogoHackernews } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";

const LeftSideBar = () => {
  return (
    <>
      <div>
        <div>
          <Link to="/">
            <div className="flex  gap-2 mb-6 mt-2 items-center ">
              <IoLogoHackernews />
            </div>

            <div className="flex  gap-2 items-center hover:bg-red-300 duration-150 px-2 rounded-2xl">
              <IoHome />
              <div>Home</div>
            </div>
          </Link>

          <Link to="/notifications">
            <div className="flex  gap-2 items-center hover:bg-red-300 duration-150 px-2 rounded-2xl">
              <IoIosNotifications />
              <div>Notifications</div>
            </div>
          </Link>

          <Link to="/updateprofile">
            <div className="flex  gap-2 items-center hover:bg-red-300 duration-150 px-2 rounded-2xl">
              <MdAccountCircle />
              <div>Profile</div>
            </div>
          </Link>
        </div>
        <div>
          <button className="flex items-center gap-2 mt-80 cursor-pointer hover:bg-red-300 duration-150 px-2 rounded-2xl">
            <BiLogOut />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default LeftSideBar;
