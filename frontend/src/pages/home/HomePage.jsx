import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment, FaRegShareSquare } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { ImSpinner8 } from "react-icons/im";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatPostDate } from "../../../util/date";

// const formattedDate = formatPostDate(post.createdAt);

// Convert image to base64 string
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

/* ---------- CommentModal ----------------------------------------- */
const CommentModal = ({
  post,
  isOpen,
  onClose,
  onCommentSubmit,
  isSubmitting,
}) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    onCommentSubmit(post._id, commentText);
    setCommentText("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-black/30 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-5  rounded-xl w-full max-w-md shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h2 className="text-lg font-bold text-red-500">Comments</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 font-bold text-lg"
          >
            ×
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-3 mb-3">
          {post.comments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No comments yet.
            </p>
          ) : (
            post.comments.map((c) => (
              <div key={c._id} className="bg-gray-100 rounded p-2 text-sm">
                <strong className="text-gray-700">
                  {c.user?.username || "User"}:
                </strong>{" "}
                {c.text}
              </div>
            ))
          )}
        </div>

        <textarea
          rows={2}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
        />

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-red-500 w-full mt-3 text-white py-2 rounded hover:bg-red-600 text-sm transition-colors"
        >
          {isSubmitting ? (
            <ImSpinner8 className="animate-spin mx-auto" />
          ) : (
            "Post Comment"
          )}
        </button>
      </div>
    </div>
  );
};

/* ---------- PostCard --------------------------------------------- */
const PostCard = ({
  post,
  authUserId,
  onCommentSubmit,
  onDelete,
  onLike,
  likeLoadingId,
  onShare,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (postId, text) => {
    setIsSubmitting(true);
    await onCommentSubmit(postId, text); // call the handler from HomePage
    setIsSubmitting(false);
    setIsModalOpen(false); //auto close modal
  };

  const isLikedByMe = post.likes.includes(authUserId);

  return (
    <div className="border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">{post.user?.fullName || "Unknown"}</h3>
          <p className="text-gray-600 text-[10px]">
            @{post.user?.username || "Unknown"}
          </p>

          <p className="text-gray-600 text-[10px]">
            {formatPostDate(post.createdAt)}
          </p>
        </div>

        {authUserId === post.user?._id && (
          <button
            onClick={() => onDelete(post._id)}
            className="text-red-500 cursor-pointer hover:text-red-600"
          >
            Delete
          </button>
        )}
      </div>

      <p className="text-sm text-gray-700 mt-1">{post.text}</p>
      {post.img && (
        <img src={post.img} alt="" className="w-full mt-2 rounded-md" />
      )}

      {/* actions */}
      <div className="flex gap-6 mt-2 text-sm text-gray-600 items-center">
        {/* comment */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 cursor-pointer group"
        >
          <FaRegComment className="w-4 h-4 text-red-500 group-hover:text-red-400" />
          <span className="text-red-500 group-hover:text-red-400">
            {post.comments.length}
          </span>
        </div>

        {/* like */}
        <button
          onClick={() => onLike(post._id)}
          className="flex items-center gap-1"
        >
          {likeLoadingId === post._id ? (
            <ImSpinner8 className="animate-spin text-red-500 w-4 h-4" />
          ) : (
            <AiOutlineLike
              className="w-4 h-4 hover:fill-red-700 cursor-pointer"
              color={isLikedByMe ? "red" : "black"}
            />
          )}
          <span className="text-red-500">{post.likes.length}</span>
        </button>

        {/* share */}
        <div
          onClick={() => onShare(post._id)}
          className="flex items-center gap-1 cursor-pointer group"
        >
          <FaRegShareSquare className="w-4 h-4 text-red-500 group-hover:text-red-400" />
        </div>
      </div>

      {/* modal */}
      <CommentModal
        post={post}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCommentSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
/* ------------------------------------------------------------------ */
/* END helper components                                              */
/* ------------------------------------------------------------------ */

const HomePage = ({ posts = [], feedType, setFeedType = () => {} }) => {
  const [postText, setPostText] = useState("");
  const [img, setImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const [activeSharePostId, setActiveSharePostId] = useState(null);

  const [likeLoadingPostId, setLikeLoadingPostId] = useState(null);

  // Auth user fetch
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
  });

  // Create post
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

  // Delete post
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => toast.error(error.message),
  });

  // Like/Unlike post
  const { mutate: likeUnlikeMutate } = useMutation({
    mutationFn: async (postId) => {
      const res = await fetch(`/api/posts/like/${postId}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to like/unlike");
      return res.json();
    },
    onMutate: (postId) => {
      setLikeLoadingPostId(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]); // refetch updated posts
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
    onSettled: () => {
      setLikeLoadingPostId(null);
    },
  });

  // Comment Mutation
  const { mutate: commentMutate } = useMutation({
    mutationFn: async ({ postId, comment }) => {
      const res = await fetch(`/api/posts/comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ text: comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },

    onSuccess: (_, variables) => {
      toast.success("Comment posted");
      queryClient.invalidateQueries(["comments", variables.postId]);
    },

    onError: (error) => {
      toast.error(error.message);
    },
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

  const handleLike = (postId) => {
    // toast.success(likedPosts[postId] ? "Post unliked" : "Post liked");
    likeUnlikeMutate(postId);
  };

  const handleShareModal = (postId) => {
    setActiveSharePostId(postId);
  };

  return (
    <>
      {/* Share Modal */}
      {activeSharePostId && (
        <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-md w-80">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Share this post</h2>
              <button
                onClick={() => setActiveSharePostId(null)}
                className="text-red-500 text-lg cursor-pointer hover:bg-red-300 px-3 rounded-2xl"
              >
                X
              </button>
            </div>
            <div className="text-sm text-gray-700">
              <p>Copy the link to share this post:</p>
              <input
                type="text"
                value={`https://yourapp.com/post/${activeSharePostId}`}
                readOnly
                className="w-full border rounded p-1 mt-2 text-xs"
              />
              <button
                className="bg-red-500 text-white text-sm px-3 py-1 mt-2 rounded hover:bg-red-600"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://yourapp.com/post/${activeSharePostId}`
                  );
                  alert("Link copied!");
                }}
              >
                Copy Link
              </button>
            </div>
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
              <PostCard
                key={post._id}
                post={post}
                authUserId={authUser?._id}
                likeLoadingId={likeLoadingPostId}
                onLike={handleLike}
                onShare={handleShareModal}
                onDelete={handleDeletePost}
                onCommentSubmit={async (postId, commentText) => {
                  try {
                    await commentMutate({ postId, comment: commentText });

                    const postToUpdate = posts.find((p) => p._id === postId);
                    if (postToUpdate) {
                      postToUpdate.comments.push({
                        text: commentText,
                        user: { username: authUser?.username || "You" },
                        _id: Math.random().toString(36),
                      });
                    }
                  } catch (err) {
                    // error is already handled in mutation
                  }
                }}
              />
            ))
          )}
        </div>{" "}
        {/* End of .flex-1 container */}
      </div>{" "}
      {/* End of main flex container */}
    </>
  );
};

export default HomePage;
