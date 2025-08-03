import React, { useState } from "react";
import { ImSpinner8 } from "react-icons/im";

const CommentModal = ({
  post,
  isOpen,
  onClose,
  onCommentSubmit,
  isSubmitting,
}) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    onCommentSubmit(post._id, commentText);
    setCommentText("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-5 rounded-xl w-full max-w-md shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h2 className="text-lg font-bold text-red-500">Comments</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 font-bold text-lg transition-transform active:scale-125 cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-3 mb-3">
          {post.comments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No comments yet.
            </p>
          ) : (
            post.comments.map((c) => (
              <div key={c._id} className="bg-gray-100 rounded p-2 text-sm">
                <strong className="text-gray-700">
                  {c.user?.username || "User"}:
                </strong>{" "}
                {c.text}
              </div>
            ))
          )}
        </div>

        <textarea
          rows={2}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
        />

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-red-500 w-full mt-3 text-white py-2 rounded hover:bg-red-600 text-sm transition-colors cursor-pointer"
        >
          {isSubmitting ? (
            <ImSpinner8 className="animate-spin mx-auto " />
          ) : (
            "Post Comment"
          )}
        </button>
      </div>
    </div>
  );
};

export default CommentModal;
