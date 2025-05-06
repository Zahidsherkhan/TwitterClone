import React from "react";
import { Routes, Route } from "react-router-dom";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import HomePage from "../pages/home/HomePage";
import Posts from "./Posts";
import Likes from "./Likes";
import CreatePost from "./CreatePost";
import Notifications from "../pages/Notifications";
import UpdateProfile from "../pages/profile/UpdateProfile";

const MainLayout = () => {
  return (
    <div className="md:flex md:justify-around bg-gradient-to-r from-red-100 via-red-200 to-red-300">
      <LeftSideBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/likes" element={<Likes />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/updateprofile" element={<UpdateProfile />} />
      </Routes>
      <RightSideBar />
    </div>
  );
};

export default MainLayout;
