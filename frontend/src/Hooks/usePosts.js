import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  likeOrUnlikePost,
  commentOnPost,
  deletePost,
  createPost,
} from "../api/posts";

export const usePostActions = () => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: likeOrUnlikePost,
    onSuccess: () => queryClient.invalidateQueries(["posts"]),
    onError: () => toast.error("Failed to like/unlike post"),
  });

  const commentMutation = useMutation({
    mutationFn: commentOnPost,
    onSuccess: (_, { postId }) => {
      toast.success("Comment posted");
      queryClient.invalidateQueries(["comments", postId]);
      queryClient.invalidateQueries(["posts"]);
    },
    onError: () => toast.error("Failed to comment"),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries(["posts"]);
    },
    onError: () => toast.error("Failed to delete post"),
  });

  return {
    likeMutation,
    commentMutation,
    deleteMutation,
  };
};
