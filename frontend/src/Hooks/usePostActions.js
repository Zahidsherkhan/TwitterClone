// hooks/usePostActions.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createPost,
  deletePost,
  likeOrUnlikePost,
  commentOnPost,
} from "../api/posts";

export const usePostActions = (authUser, posts = []) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Post created successfully!");
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("😢 Post deleted! Poof 🧹");
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => toast.error(error.message),
  });

  const likeMutation = useMutation({
    mutationFn: likeOrUnlikePost,
    onError: (error) => toast.error(error.message),
  });

  const commentMutation = useMutation({
    mutationFn: commentOnPost,
    onSuccess: (_, { postId }) => {
      toast.success("Comment posted now run 🏃‍♀️😆");
      queryClient.invalidateQueries(["comments", postId]);
    },
    onError: (error) => toast.error(error.message),
  });

  const handleCreatePost = (data) => {
    createMutation.mutate(data);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("⚠️ Are you sure to delete this Post 😬")) {
      deleteMutation.mutate(postId);
    } else toast("😅 Whew! Nothing was deleted.");
  };

  const handleLikePost = (postId, setLikeLoadingId) => {
    setLikeLoadingId?.(postId);
    likeMutation.mutate(postId, {
      onSettled: () => setLikeLoadingId?.(null),
      onSuccess: () => queryClient.invalidateQueries(["posts"]),
    });
  };

  const handleCommentSubmit = (postId, commentText) => {
    commentMutation.mutate({ postId, comment: commentText });

    const postToUpdate = posts.find((p) => p._id === postId);
    if (postToUpdate) {
      postToUpdate.comments.push({
        text: commentText,
        user: { username: authUser?.username || "You" },
        _id: Math.random().toString(36),
      });
    }
  };

  return {
    createMutation,
    handleCreatePost,
    handleDeletePost,
    handleLikePost,
    handleCommentSubmit,
  };
};
