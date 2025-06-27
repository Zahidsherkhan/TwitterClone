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
import toast from "react-hot-toast"; // Import toast
import Profile from "../pages/Profile";

const MainLayout = () => {
  const handleCreatePost = () => {
    // Simulate post creation
    toast.success("Post created successfully!");
  };

  return (
    <div className="md:flex md:justify-around bg-gradient-to-r from-red-100 via-red-200 to-red-300">
      <LeftSideBar />
      <div className="flex-1">
        <button
          className="bg-gradient-to-r from-red-200 via-red-300 to-red-400 py-2 rounded-md"
          onClick={handleCreatePost}
        >
          Create Post
        </button>
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/posts" element={<Posts />} />

          <Route path="/likes" element={<Likes />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/updateprofile" element={<UpdateProfile />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <RightSideBar />
    </div>
  );
};

export default MainLayout;
