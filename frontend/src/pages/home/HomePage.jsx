import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const createPost = async (postText) => {
  const response = await fetch("/api/posts/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: postText }),
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
};

const deletePost = async (postId) => {
  const response = await fetch(`/api/posts/delete/${postId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }

  return response.json();
};

const HomePage = ({ posts = [], feedType, setFeedType = () => {} }) => {
  const [postText, setPostText] = useState("");
  const queryClient = useQueryClient();

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

  const handleCreatePost = () => {
    if (postText.trim() !== "") {
      mutation.mutate(postText);
    }
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      handleCreatePost();
    }
  };

  const handleDeletePost = async (postId) => {
    deleteMutation.mutate(postId);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 max-w-xl mx-auto w-full border-l border-r overflow-y-auto max-h-screen scroll-hidden">
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

        <div className="flex items-start gap-2 px-4 py-3 border-b">
          <img src="vite.svg" className="w-10 h-10 rounded-full" alt="avatar" />
          <div className="flex-1">
            <div className="text-gray-600">What is happening?</div>
            <input
              name="postText"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              onKeyDown={handleEnterKey}
              className="border-x rounded p-1 pl-3 text-[12px] mr-2 w-full mt-1"
              type="text"
              placeholder="Write something..."
            />
            <input type="file" className="mt-2 text-sm" />
            <div>
              <button
                className="bg-gradient-to-r from-red-200 via-red-300 to-red-400 p-2 text-[10px] mt-2 font-semibold cursor-pointer rounded-lg hover:from-red-400 hover:via-red-500"
                onClick={handleCreatePost}
              >
                {mutation.isLoading ? "Posting..." : "Create Post"}
              </button>
            </div>
          </div>
        </div>

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
                <div>
                  <div className="font-bold">
                    {post.user?.username || post.user?.name || "Unknown"}
                  </div>
                  <div className="text-gray-700">{post.text}</div>
                  {authUser?._id === post.user?._id && (
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-red-500 text-sm mt-1 hover:underline"
                    >
                      Delete
                    </button>
                  )}
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
                <div className="cursor-pointer hover:bg-red-400 px-3 rounded-2xl">
                  C
                </div>
                <div className="cursor-pointer hover:bg-red-400 px-3 rounded-2xl">
                  S
                </div>
                <div className="cursor-pointer hover:bg-red-400 px-3 rounded-2xl">
                  L
                </div>
                <div className="cursor-pointer hover:bg-red-400 px-3 rounded-2xl">
                  B
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
