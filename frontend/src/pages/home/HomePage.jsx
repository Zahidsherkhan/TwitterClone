import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment, FaRegShareSquare } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { ImSpinner8 } from "react-icons/im";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Converts image to base64 string
const convertToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const createPost = async ({ text, img }) => {
  const response = await fetch("/api/posts/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, img }),
  });

  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
};

const deletePost = async (postId) => {
  const response = await fetch(`/api/posts/delete/${postId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete post");
  return response.json();
};

const HomePage = ({ posts = [], feedType, setFeedType = () => {} }) => {
  const [postText, setPostText] = useState("");
  const [img, setImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [commnetModal, setcommnetModal] = useState(false);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const handleModal = () => setcommnetModal(true);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Post created successfully!");
      setPostText("");
      setImg(null);
      setImgPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => toast.error(error.message),
  });

  const handleCreatePost = async () => {
    if (postText.trim() === "" && !img) {
      toast.error("Please enter text or select an image.");
      return;
    }

    let base64Img = null;
    if (img) base64Img = await convertToBase64(img);

    mutation.mutate({ text: postText, img: base64Img });
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") handleCreatePost();
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(postId);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      {/* Modal */}
      {commnetModal && (
        <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-md w-96">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">What do you think?</h2>
              <button
                onClick={() => setcommnetModal(false)}
                className="text-red-500 text-lg cursor-pointer hover:bg-red-300 px-3 rounded-2xl"
              >
                X
              </button>
            </div>
            <textarea
              placeholder="Write your comment..."
              className="w-full border rounded p-2 text-sm"
              rows={3}
            />
            <button className="bg-red-500 mt-3 text-white px-4 py-1 rounded hover:bg-red-600 text-sm cursor-pointer">
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex h-screen">
        <div className="flex-1 max-w-xl mx-auto w-full border-l border-r overflow-y-auto max-h-screen scroll-hidden">
          {/* Feed Switch */}
          <div className="flex justify-around border-b py-2 sticky top-0 z-10 bg-red-200">
            <button
              onClick={() => setFeedType("forYou")}
              className={`font-semibold pb-2 cursor-pointer hover:text-red-500 ${
                feedType === "forYou"
                  ? "border-b-2 border-red-500 text-red-500"
                  : "text-gray-500"
              }`}
            >
              For You
            </button>
            <button
              onClick={() => setFeedType("following")}
              className={`font-semibold pb-2 cursor-pointer hover:text-red-500 ${
                feedType === "following"
                  ? "border-b-2 border-red-500 text-red-500"
                  : "text-gray-500"
              }`}
            >
              Following
            </button>
          </div>

          {/* Post Input */}
          <div className="flex items-start gap-2 px-4 py-3 border-b">
            <img
              src="vite.svg"
              className="w-10 h-10 rounded-full"
              alt="avatar"
            />
            <div className="flex-1">
              <div className="text-gray-600">What is happening?</div>
              <input
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                onKeyDown={handleEnterKey}
                className="border-x rounded p-1 pl-3 text-[12px] mr-2 w-full mt-1"
                type="text"
                placeholder="Write something..."
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="mt-2 text-sm"
                onChange={handleImageChange}
              />
              {imgPreview && (
                <div className="mt-2">
                  <img
                    src={imgPreview}
                    alt="Preview"
                    className="max-w-full rounded-md"
                  />
                </div>
              )}
              <div>
                <button
                  className="bg-gradient-to-r from-red-200 via-red-300 to-red-400 p-2 text-[10px] mt-2 font-semibold cursor-pointer rounded-lg hover:from-red-400 hover:via-red-500"
                  onClick={handleCreatePost}
                >
                  {mutation.isPending ? (
                    <ImSpinner8 className="animate-spin text-sm" />
                  ) : (
                    "Create Post"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Posts */}
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 my-4">No posts to show.</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="border-b py-4 px-4">
                <div className="flex items-start gap-3 mb-2">
                  <img
                    src="vite.svg"
                    className="w-10 h-10 rounded-full"
                    alt="avatar"
                  />
                  <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold">
                        {post.user?.username || post.user?.name || "Unknown"}
                      </span>
                      {authUser?._id === post.user?._id && (
                        <div>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="text-red-500 hover:underline hover:bg-red-400 hover:text-gray-700 px-3 cursor-pointer rounded-2xl"
                          >
                            {deleteMutation.isPending ? (
                              <ImSpinner8 className="animate-spin" />
                            ) : (
                              <MdOutlineDelete size={18} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="text-gray-700 text-sm mt-1">
                      {post.text}
                    </div>
                  </div>
                </div>

                {post.img && (
                  <img
                    src={post.img}
                    alt="post"
                    className="w-full rounded-md mb-2"
                  />
                )}

                <div className="flex justify-around text-sm text-gray-600 w-full">
                  <div
                    className="cursor-pointer hover:bg-red-400 px-3 rounded-2xl"
                    onClick={handleModal}
                  >
                    <FaRegComment />
                  </div>
                  <div className="cursor-pointer hover:bg-red-400 px-3 rounded-2xl">
                    <FaRegShareSquare />
                  </div>
                  <div className="cursor-pointer hover:bg-red-400 px-3 rounded-2xl">
                    <AiOutlineLike color="black" />
                  </div>
                  <div className="cursor-pointer hover:bg-red-400 px-3 rounded-2xl">
                    <CiBookmark color="black" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
