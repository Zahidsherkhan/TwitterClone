import React from "react";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../Hooks/useFollow";

// FollowSuggestion receives props from RightSideBar
const FollowSuggestion = ({
  name,
  username,
  avatar,
  onFollowClick,
  isPending,
}) => {
  return (
    <div className="flex justify-between items-center mb-3 gap-3 ">
      <div className="flex items-center  gap-2">
        <img src={avatar} alt={name} className="w-6 h-6 rounded-full" />
        <div className="flex flex-col ">
          <span className="text-[12px]">{name}</span>
          <span className="text-gray-600 text-[10px]">{username}</span>
        </div>
      </div>

      <button
        disabled={isPending}
        onClick={onFollowClick}
        className="text-[10px] cursor-pointer hover:bg-red-600 duration-150 bg-red-200 px-2 py-1 rounded-2xl disabled:opacity-50"
      >
        {isPending ? "Following..." : "Follow"}
      </button>
    </div>
  );
};

const RightSideBar = () => {
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
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      return data;
    },
  });

  const { followMutation, isPending } = useFollow();

  return (
    <div className="ml-6 bg-gradient-to-t from-red-300 via-red-400 to-red-500 rounded-xl px-3 py-4 mr-20 mt-5 mb-5">
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
          isPending={isPending}
          onFollowClick={() => followMutation(user._id, console.log(user._id))}
        />
      ))}
    </div>
  );
};

export default RightSideBar;
