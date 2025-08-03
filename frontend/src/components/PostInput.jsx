import React, { useState, useRef } from "react";
import { ImSpinner8 } from "react-icons/im";
import toast from "react-hot-toast";
import { FiImage } from "react-icons/fi";
import { useAuthUser } from "../Hooks/useAuthUser";

const MAX_IMG_SIZE_MB = 3;

const PostInput = ({ onSubmit, isCreating }) => {
  const [img, setImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [postText, setPostText] = useState("");

  const { authUser } = useAuthUser();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    if (file.size / 1024 / 1024 > MAX_IMG_SIZE_MB) {
      toast.error("Image must be less than 3MB.");
      return;
    }

    setImg(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleCreatePost = async () => {
    if (isCreating) return;

    if (postText.trim() === "" && !img) {
      toast.error("Please enter text or select an image.");
      return;
    }

    let base64Img = null;
    try {
      if (img) base64Img = await convertToBase64(img);
    } catch (err) {
      toast.error("Failed to load image.");
      return;
    }

    onSubmit({ text: postText, img: base64Img });

    setPostText("");
    setImg(null);
    setImgPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") handleCreatePost();
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className="flex items-start gap-2 px-4 py-3 mt-8 border-b">
      <img
        src={authUser?.profileImg || "avatar1.svg"}
        className="w-10 h-10 rounded-full"
        alt="avatar"
      />
      <div className="flex-1">
        <div className="text-gray-600">🧠 What’s on your mind?</div>
        <input
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          onKeyDown={handleEnterKey}
          className="border-x rounded p-1 pl-3 text-[12px] mr-2 w-full mt-1"
          type="text"
          placeholder="Write something..."
          disabled={isCreating}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="mt-2 text-sm"
          onChange={handleImageChange}
          disabled={isCreating}
          hidden
        />
        <button
          className="mt-2 ml-2 text-red-500 cursor-pointer hover:scale-125 transition-transform duration-150
"
          onClick={() => fileInputRef.current?.click()}
        >
          <FiImage />
        </button>
        {imgPreview && (
          <div className="mt-20">
            <img
              src={imgPreview}
              alt="Preview"
              className="max-w-full  rounded-md"
            />
          </div>
        )}
        <div>
          <button
            className="bg-gradient-to-r from-red-200 via-red-300 to-red-400 p-2 text-[10px] mt-2 font-semibold cursor-pointer rounded-lg hover:from-red-400 hover:via-red-500 disabled:opacity-60"
            onClick={handleCreatePost}
            disabled={isCreating}
          >
            {isCreating ? (
              <ImSpinner8 className="animate-spin text-sm" />
            ) : (
              "Create Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostInput;
