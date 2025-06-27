import React from "react";

const HomePage = ({ posts = [], feedType, setFeedType = () => {} }) => {
  return (
    <div className="flex flex-col max-w-xl mx-auto w-full border-l border-r">
      {/* Feed Switch Buttons */}
      <div className="flex justify-around border-b py-2">
        <button
          onClick={() => setFeedType("forYou")}
          className={`font-semibold pb-2 cursor-pointer hover:text-red-500 ${
            feedType === "forYou"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-500"
          }`}
        >
          For You
        </button>
        <button
          onClick={() => setFeedType("following")}
          className={`font-semibold pb-2 cursor-pointer hover:text-red-500 ${
            feedType === "following"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-500"
          }`}
        >
          Following
        </button>
      </div>

      {/* 🖊️ Post Input */}
      <div className="flex items-start gap-2 px-4 py-3 border-b">
        <img src="vite.svg" className="w-10 h-10 rounded-full" alt="avatar" />
        <div className="flex-1">
          <div className="text-gray-600">What is happening?</div>
          <input
            className="border-x rounded p-1 text-[12px] mr-2 w-full mt-1"
            type="text"
            placeholder="Write something..."
          />
          <input type="file" className="mt-2" />
        </div>
      </div>

      {/* 📰 Post Feed */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-500 my-4">No posts to show.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="border-b py-4 px-4">
            {/* Top Info */}
            <div className="flex items-start gap-3 mb-2">
              <img
                src="vite.svg"
                className="w-10 h-10 rounded-full"
                alt="avatar"
              />
              <div>
                <div className="font-bold">
                  {post.user?.username || post.user?.name || "Unknown"}
                </div>
                <div className="text-gray-700">{post.text}</div>
              </div>
            </div>

            {/* Post Image (conditionally rendered) */}
            {post.img && (
              <img
                src={post.img}
                alt="post"
                className="w-full rounded-md mb-2"
              />
            )}

            {/* Reaction Row */}
            <div className="flex justify-around text-sm text-gray-600 w-full">
              <div className="cursor-pointer hover:bg-red-400 px-3 rounded-2xl">
                C
              </div>
              <div className="cursor-pointer hover:bg-red-400 px-3 rounded-2xl">
                S
              </div>
              <div className="cursor-pointer hover:bg-red-400 px-3 rounded-2xl">
                L
              </div>
              <div className="cursor-pointer hover:bg-red-400 px-3 rounded-2xl">
                B
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HomePage;
