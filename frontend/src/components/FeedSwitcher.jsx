import React from "react";

const FeedSwitcher = ({ feedType, setFeedType, tabs }) => {
  return (
    <div className="flex justify-around border-b py-2 sticky top-0 z-10 bg-red-300 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setFeedType(tab.value)}
          className={`font-semibold pb-2 rounded cursor-pointer hover:text-red-500 ${
            feedType === tab.value
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-500"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FeedSwitcher;
