import React from "react";

const FollowSuggestion = ({ name, handle, avatar }) => {
  return (
    <div className="flex justify-between items-center mb-3 gap-3">
      <div className="flex items-center gap-2">
        <img src={avatar} alt={name} className="w-6 h-6 rounded-full" />
        <div className="flex flex-col">
          <span className="text-[12px]">{name}</span>
          <span className="text-gray-600 text-[10px]">{handle}</span>
        </div>
      </div>
      <button className="text-[10px] cursor-pointer hover:bg-red-600 duration-150 bg-red-200 px-2 py-1 rounded-2xl">
        Follow
      </button>
    </div>
  );
};

const RightSideBar = () => {
  return (
    <div className="bg-gradient-to-t from-red-300 via-red-400 to-red-500 rounded-xl px-3 py-4">
      <h4 className="text-[12px] font-semibold mb-2">Want to follow</h4>

      <FollowSuggestion name="Bugatata" handle="@buga" avatar="/avatar1.svg" />
      <FollowSuggestion name="Furarari" handle="@messi" avatar="/avatar2.svg" />
      <FollowSuggestion
        name="Lambargani"
        handle="@ronaldo"
        avatar="/avatar1.svg"
      />
    </div>
  );
};

export default RightSideBar;
