import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import PostInput from "../../components/PostInput";
import PostCard from "../../components/PostCard";
import PostSkeleton from "../../components/PostSkeleton";
import CommentModal from "../../components/CommentModal";
import ShareModal from "../../components/ShareModal";
import FeedSwitcher from "../../components/FeedSwitcher";

import { useAuthUser } from "../../Hooks/useAuthUser";
import { usePostActions } from "../../Hooks/usePostActions";

const fetchPosts = async (feedType) => {
  let endpoint = "/api/posts/all";

  if (feedType === "Following") {
    endpoint = "/api/posts/following";
  } else if (feedType === "ForYou") {
    endpoint = "/api/posts/all";
  }

  const res = await fetch(endpoint);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
};

const HomePage = () => {
  const authUser = useAuthUser();
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [activeSharePostId, setActiveSharePostId] = useState(null);
  const [likeLoadingPostId, setLikeLoadingPostId] = useState(null);
  const [feedType, setFeedType] = useState("ForYou");

  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts", feedType],
    queryFn: () => fetchPosts(feedType),
  });

  const {
    createMutation,
    handleCreatePost,
    handleDeletePost,
    handleLikePost,
    handleCommentSubmit,
  } = usePostActions(authUser, posts);

  const handleCommentOpen = (postId) => {
    setActiveCommentPostId(postId);
  };

  return (
    <section className="max-w-xl w-full mx-auto px-4">
      <PostInput
        onSubmit={handleCreatePost}
        isCreating={createMutation.isPending}
      />

      <FeedSwitcher
        feedType={feedType}
        setFeedType={setFeedType}
        tabs={[
          { label: "For You", value: "ForYou" },
          { label: "Following", value: "Following" },
        ]}
      />

      {isLoading ? (
        <div className="mt-6 flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <p className="text-center text-red-400 mt-6">Failed to load posts.</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-400 mt-6">No posts to show.</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            authUserId={authUser?._id}
            likeLoadingId={likeLoadingPostId}
            onLike={(id) => handleLikePost(id, setLikeLoadingPostId)}
            onShare={setActiveSharePostId}
            onDelete={handleDeletePost}
            onCommentSubmit={handleCommentSubmit}
            onCommentOpen={handleCommentOpen}
          />
        ))
      )}

      {activeCommentPostId && (
        <CommentModal
          postId={activeCommentPostId}
          onClose={() => setActiveCommentPostId(null)}
          onSubmit={handleCommentSubmit}
        />
      )}

      {activeSharePostId && (
        <ShareModal
          postId={activeSharePostId}
          onClose={() => setActiveSharePostId(null)}
        />
      )}
    </section>
  );
};

export default HomePage;
