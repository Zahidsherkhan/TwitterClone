import React from "react";
import { useQuery } from "@tanstack/react-query";

// This is a presentational component only
const FollowSuggestion = ({ name, username, avatar }) => {
  return (
    <div className="flex justify-between items-center mb-3 gap-3">
      <div className="flex items-center gap-2">
        <img src={avatar} alt={name} className="w-6 h-6 rounded-full" />
        <div className="flex flex-col">
          <span className="text-[12px]">{name}</span>
          <span className="text-gray-600 text-[10px]">{username}</span>
        </div>
      </div>
      <button className="text-[10px] cursor-pointer hover:bg-red-600 duration-150 bg-red-200 px-2 py-1 rounded-2xl">
        Follow
      </button>
    </div>
  );
};

const RightSideBar = () => {
  // Fetched suggested users from backend
  const {
    data: suggestedUsers = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      const res = await fetch("/api/users/suggested");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    },
  });

  return (
    <div className="bg-gradient-to-t from-red-300 via-red-400 to-red-500 rounded-xl px-3 py-4 mr-20 mt-5 mb-5">
      <h4 className="text-[12px] font-semibold mb-2">Want to follow</h4>

      {isLoading && (
        <p className="text-[10px] text-white">Loading suggestions...</p>
      )}

      {isError && (
        <p className="text-[10px] text-white">Error: {error.message}</p>
      )}

      {suggestedUsers.map((user) => (
        <FollowSuggestion
          key={user._id}
          name={user.name}
          username={`@${user.username}`}
          avatar={user.avatar || "/avatar1.svg"}
        />
      ))}
    </div>
  );
};

export default RightSideBar;
