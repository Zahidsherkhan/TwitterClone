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
      return result;
    },
  });

  // Skeleton loader UI (Tailwind)
  const SkeletonCard = () => (
    <div className="border-b px-4 py-4 animate-pulse space-y-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/4 bg-gray-300 rounded" />
          <div className="h-3 w-3/4 bg-gray-300 rounded" />
        </div>
      </div>
      <div className="w-full h-48 bg-gray-300 rounded" />
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex justify-around border-b py-2 sticky top-0 z-10 bg-red-200">
          <button
            className={`font-semibold pb-2 cursor-pointer hover:text-red-500 ${
              feedType === "forYou"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-500"
            }`}
            onClick={() => setFeedType("forYou")}
          >
            For You
          </button>
          <button
            className={`font-semibold pb-2 cursor-pointer hover:text-red-500 ${
              feedType === "following"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-500"
            }`}
            onClick={() => setFeedType("following")}
          >
            Following
          </button>
        </div>
        <div className="flex-1 overflow-y-auto max-w-xl w-full mx-auto border-l border-r">
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

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
