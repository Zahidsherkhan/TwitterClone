import React, { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { formatMemberSinceDate } from "../../util/date";

const dummyData = {
  fullName: "John Doe",
  username: "johndoe",
  bio: "This is a dummy bio. Something went wrong while fetching real data.",
  biolink: "About Section yet to be written",
  link: "https://example.com",
  profileImage: "avatar1.svg",
  coverImage: "bg-gray.jpg",
};

const Profile = () => {
  const profileInputRef = useRef();
  const coverInputRef = useRef();
  const [coverImage, setCoverImage] = useState(dummyData.coverImage);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    link: "",
  });

  const { username } = useParams();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "cover") {
        setCoverImage(reader.result);
        toast.success("Cover image updated");
      } else {
        toast.success("Profile image updated");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = () => {
    console.log("Updated profile data:", formData);
    console.log("Cover Image:", coverImage);
    setShowModal(false);
  };

  const {
    data: user = dummyData,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        console.error("Fetching failed, using dummy data:", error.message);
        return dummyData;
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  const joinedDate = formatMemberSinceDate(user?.createdAt);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Cover Image */}
      <div className="relative">
        <img
          src={coverImage || dummyData.coverImage}
          className="w-full h-52 object-cover rounded-md"
          alt="Cover"
        />
        <button
          className="absolute top-2 right-2 bg-white px-2 py-1 text-xs rounded shadow cursor-pointer"
          onClick={() => coverInputRef.current.click()}
        >
          ✎ Edit Cover
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={coverInputRef}
          onChange={(e) => handleImageChange(e, "cover")}
        />
      </div>

      {/* Profile Section */}
      {isLoading ? (
        <div>Loading info...</div>
      ) : (
        <>
          <div className="flex justify-between mt-4 items-end">
            <div className="relative ml-6">
              <img
                src={user.profileImage || dummyData.profileImage}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-white -mt-14 object-cover"
              />
              <button
                className="absolute bottom-0 right-0 bg-white text-xs px-1 rounded shadow cursor-pointer"
                onClick={() => profileInputRef.current.click()}
              >
                ✎
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={profileInputRef}
                onChange={(e) => handleImageChange(e, "profile")}
              />
            </div>

            <button
              className="bg-red-400 border border-red-500 text-white rounded px-2 py-1 cursor-pointer hover:bg-red-500 transition ml-8"
              onClick={() => setShowModal(true)}
            >
              Edit Profile
            </button>
          </div>

          {/* Info Preview */}
          <div className="mt-4 px-4">
            <h2 className="text-xl font-semibold">{user.fullName}</h2>
            <p className="text-gray-600">@{user.username}</p>
            <p className="text-sm mt-2">{user.bio || dummyData.biolink}</p>
            <div className="flex flex-row">
              <a
                href={user.link}
                className="text-blue-500 text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                🔗
                {user.link || dummyData.link}
              </a>
            </div>
            <p className="text-gray-600 text-sm">
              🗓️{joinedDate || "🗓️ Joined since infinity"}
            </p>
            <div className="flex gap-3">
              <div className="text-sm font-semibold">
                {user.following?.length || 0}{" "}
                <span className="text-gray-600 font-normal">Following</span>
              </div>
              <div className="text-sm font-semibold">
                {user.followers?.length || 0}{" "}
                <span className="text-gray-600 font-normal">Followers</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
            <button
              className="absolute top-2 right-2 text-xl hover:text-red-500 hover:bg-red-400 rounded-2xl p-1 cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>
            <div className="flex flex-col gap-3">
              {[
                "fullName",
                "username",
                "email",
                "bio",
                "currentPassword",
                "newPassword",
                "link",
              ].map((field) => (
                <input
                  key={field}
                  type={
                    field.toLowerCase().includes("password")
                      ? "password"
                      : "text"
                  }
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  className="border p-2 rounded"
                />
              ))}
              <button
                className="bg-red-400 hover:bg-red-600 text-white py-2 rounded cursor-pointer"
                onClick={handleUpdate}
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
