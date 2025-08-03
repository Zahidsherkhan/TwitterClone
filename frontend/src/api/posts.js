// src/api/posts.js

export const createPost = async ({ text, img }) => {
  const res = await fetch("/api/posts/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, img }),
  });

  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
};

export const deletePost = async (postId) => {
  const res = await fetch(`/api/posts/delete/${postId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete post");
  return res.json();
};

export const likeOrUnlikePost = async (postId) => {
  const res = await fetch(`/api/posts/like/${postId}`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to like/unlike post");
  return res.json();
};

export const commentOnPost = async ({ postId, comment }) => {
  const res = await fetch(`/api/posts/comment/${postId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: comment }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to post comment");
  }

  return data;
};
// User Created Posts
export const getUserPosts = async (username) => {
  const res = await fetch(`/api/posts/user/${username}`);
  if (!res.ok) throw new Error("Failed to fetch user posts");
  return res.json();
};

// User Liked Posts
export const getUserLikedPosts = async (userId) => {
  const res = await fetch(`/api/posts/likes/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch liked posts");
  return res.json();
};
