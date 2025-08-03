import React from "react";
import { Routes, Route } from "react-router-dom";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import HomePage from "../pages/home/HomePage";
import Posts from "./Posts";
import Likes from "./Likes";
import CreatePost from "./CreatePost";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";

const MainLayout = () => {
  return (
    <div className="md:flex md:justify-around bg-gradient-to-r from-red-200 via-pink-200 to-pink-400">
      <LeftSideBar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="posts" element={<Posts />} />
          <Route path="likes" element={<Likes />} />
          <Route path="createpost" element={<CreatePost />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile/:username" element={<Profile />} />
        </Routes>
      </div>
      <RightSideBar />
    </div>
  );
};

export default MainLayout;
