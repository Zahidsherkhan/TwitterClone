import React from "react";

const ShareModal = ({ postId, onClose }) => {
  const postUrl = `https://yourapp.com/post/${postId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(postUrl);
    alert("Link copied!");
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-4 rounded-md shadow-md w-80">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Share this post</h2>
          <button
            onClick={onClose}
            className="text-red-500 text-lg cursor-pointer hover:bg-red-300 px-3 rounded-2xl transition-transform active:scale-125"
          >
            X
          </button>
        </div>
        <div className="text-sm text-gray-700">
          <p>Copy the link to share this post:</p>
          <input
            type="text"
            value={postUrl}
            readOnly
            className="w-full border rounded p-1 mt-2 text-xs"
          />
          <button
            className="bg-red-500 text-white text-sm px-3 py-1 mt-2 rounded hover:bg-red-600 cursor-pointer"
            onClick={handleCopy}
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
