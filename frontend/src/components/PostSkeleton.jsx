// components/PostSkeleton.jsx
import React from "react";

const PostSkeleton = () => {
  return (
    <div className="animate-pulse p-4 border-b border-gray-200">
      {/* Profile Row */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div className="flex-1 h-4 bg-gray-300 rounded w-1/3"></div>
      </div>

      {/* Text */}
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>

      {/* Image */}
      <div className="mt-4 w-full h-60 bg-gray-300 rounded-lg"></div>
    </div>
  );
};

export default PostSkeleton;
