import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthUser } from "../Hooks/useAuthUser";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { replace, useNavigate } from "react-router-dom";

const EditProfileModal = ({ user, onClose, onProfileUpdate }) => {
  const authUser = useAuthUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  useEffect(() => {
    if (!user) return;
    setFormData({
      fullName: user.fullName || "",
      username: user.username || "",
      email: user.email || "",
      bio: user.bio || "",
      link: user.link || "",
      newPassword: "",
      currentPassword: "",
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/users/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(
        data.error ? `${data.error} 😕` : "Failed to update profile 😕"
      );
    } else {
      toast.success("Profile updated! 🎉");
      onProfileUpdate?.(); // optional chaining for safety
      onClose();
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      if (user.username !== formData.username) {
        navigate(`/profile/${formData.username}`, { replace: true });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-2">
      <div className="bg-white p-4 rounded-md w-full max-w-xl relative shadow-md">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black hover:bg-red-100 cursor-pointer p-1 rounded-full text-sm"
          onClick={onClose}
        >
          ❌
        </button>
        <h2 className="text-md font-semibold mb-4 text-center">
          Edit Profile 🛠
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm"
        >
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="border p-1.5 rounded"
            value={formData.fullName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="border p-1.5 rounded"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border p-1.5 rounded"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="bio"
            placeholder="Bio"
            className="border p-1.5 rounded"
            value={formData.bio}
            onChange={handleChange}
          />
          <input
            type="text"
            name="link"
            placeholder="Website / Link"
            className="border p-1.5 rounded"
            value={formData.link}
            onChange={handleChange}
          />
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            className="border p-1.5 rounded"
            value={formData.currentPassword}
            onChange={handleChange}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            className="border p-1.5 rounded"
            value={formData.newPassword}
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-red-400 text-white py-1.5 rounded hover:bg-red-500 text-sm cursor-pointer"
            >
              💾 Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
