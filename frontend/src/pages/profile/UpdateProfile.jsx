import React, { useState, useRef } from "react";

const UpdateProfile = () => {
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

  const [profileImage, setProfileImage] = useState("avatar1.svg");
  const [coverImage, setCoverImage] = useState("bg-gray.jpg");

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === "profile") setProfileImage(imageUrl);
      else if (type === "cover") setCoverImage(imageUrl);
    }
  };

  const handleUpdate = () => {
    console.log("Updated profile data:", formData);
    console.log("Profile Image:", profileImage);
    console.log("Cover Image:", coverImage);
    setShowModal(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Cover Image */}
      <div className="relative">
        <img
          src={coverImage}
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

      {/* Profile Image */}
      <div className="flex justify-between mt-4 items-end">
        <div className="relative ml-6">
          <img
            src={profileImage}
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
        <h2 className="text-xl font-semibold">
          {formData.fullName || "Your Name"}
        </h2>
        <p className="text-gray-600">@{formData.username || "yourusername"}</p>
        <p className="text-sm mt-2">{formData.bio || "Your bio goes here."}</p>
        <a href="#" className="text-blue-500 text-sm">
          {formData.link || "yourwebsite.com"}
        </a>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
            <button
              className="absolute top-2 right-2 text-xl"
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

export default UpdateProfile;
