import React, { useState, useRef } from "react";
import { FaImage } from "react-icons/fa";
import { IoMdClose } from "react-icons/io"; // Cross icon
import { useAuthUser } from "../Hooks/useAuthUser";

const CreatePost = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);

  const authUser = useAuthUser();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handlePost = () => {
    console.log("Posting...");
    console.log("Text:", text);
    console.log("Image:", selectedImage);
    // my post logic
  };

  return (
    <div className="max-w-md mx-auto border p-4 rounded-lg shadow-md bg-gradient-to-t from-red-300 via-red-400 to-red-500">
      {/* User Info */}
      <div className="flex gap-2 items-center mb-4">
        <img
          src={authUser.profileImg || "avatar2.svg"}
          className="w-10 h-10 rounded-full"
          alt="avatar"
        />
        <div className="text-gray-700 font-semibold">What is happening?!</div>
      </div>

      {/* Image Preview with Remove Icon */}
      {selectedImage && (
        <div className="relative mb-4">
          <img
            src={selectedImage}
            alt="Selected"
            className="w-1/2 max-h-80 object-contain rounded-lg"
          />
          <button
            onClick={removeImage}
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow text-gray-700 hover:text-red-500"
            title="Remove image"
          >
            <IoMdClose size={20} />
          </button>
        </div>
      )}

      {/* Text Input */}
      <textarea
        placeholder="What's on your mind?"
        className="w-full border p-2 rounded-md resize-none mb-4"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      {/* Bottom Actions */}
      <div className="flex justify-between items-center">
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* Image icon to trigger file input */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="text-red-100 hover:text-red-600 text-xl"
          title="Add Image"
        >
          <FaImage />
        </button>

        {/* Post button */}
        <button
          onClick={handlePost}
          className="bg-red-200 text-black px-4 py-1 rounded hover:bg-red-500"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
