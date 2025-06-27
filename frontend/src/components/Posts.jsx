import React, { useState } from "react";
import HomePage from "../pages/home/HomePage";
import { useQuery } from "@tanstack/react-query";

const Posts = () => {
  const [feedType, setFeedType] = useState("forYou");

  const endpoint =
    feedType === "forYou" ? "/api/posts/all" : "/api/posts/following";

  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", feedType],
    queryFn: async () => {
      const res = await fetch(endpoint);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Something went wrong");
      return result; // Backend returns an array of posts
    },
  });

  if (isLoading) return <div className="text-center mt-4">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center mt-4">
        Error loading posts: {error.message}
      </div>
    );

  return (
    <HomePage posts={posts} feedType={feedType} setFeedType={setFeedType} />
  );
};

export default Posts;
