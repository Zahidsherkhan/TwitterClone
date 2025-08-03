import React, { useState } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegComment, FaRegShareSquare } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { formatPostDate } from "../../util/date";
import CommentModal from "./CommentModal";
import { MdDelete } from "react-icons/md";

const PostCard = ({
  post,
  authUserId,
  onCommentSubmit,
  onDelete,
  onLike,
  likeLoadingId,
  onShare,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (postId, text) => {
    setIsSubmitting(true);
    await onCommentSubmit(postId, text);
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const isLikedByMe = post.likes?.includes(authUserId);

  return (
    <div className="border-b px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">{post.user?.fullName || "Unknown"}</h3>
          <p className="text-gray-600 text-[10px]">
            @{post.user?.username || "Unknown"}
          </p>
          <p className="text-gray-600 text-[10px]">
            {formatPostDate(post.createdAt)}
          </p>
        </div>

        {authUserId === post.user?._id && (
          <button
            onClick={() => onDelete(post._id)}
            className="text-red-500 cursor-pointer hover:text-red-600 transition-transform active:scale-125"
          >
            <MdDelete />
          </button>
        )}
      </div>

      {/* Post Text */}
      <p className="text-sm text-gray-700 mt-1">{post.text}</p>

      {/* Post Image */}
      {post.img && (
        <div className="max-h-[300px] overflow-hidden rounded-md mt-2">
          <img
            src={post.img}
            alt="Post image"
            className="w-full max-h-80 object-contain rounded-2xl "
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-6 mt-2 text-sm text-gray-600 items-center">
        {/* Comment */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 cursor-pointer group"
        >
          <FaRegComment className="w-4 h-4 text-red-500 group-hover:text-red-400 transition-transform active:scale-125" />
          <span className="text-red-500 group-hover:text-red-400">
            {post.comments?.length || 0}
          </span>
        </div>

        {/* Like */}
        <button
          onClick={() => onLike(post._id)}
          className="flex items-center gap-1"
        >
          {likeLoadingId === post._id ? (
            <ImSpinner8 className="animate-spin text-red-500 w-4 h-4" />
          ) : isLikedByMe ? (
            <AiFillLike className="w-4 h-4 text-red-500 transition-transform active:scale-125 cursor-pointer" />
          ) : (
            <AiOutlineLike className="w-4 h-4 text-black hover:text-red-500 transition-transform cursor-pointer active:scale-125" />
          )}
          <span className="text-red-500">{post.likes?.length || 0}</span>
        </button>

        {/* Share */}
        <div
          onClick={() => onShare(post._id)}
          className="flex items-center gap-1 cursor-pointer group"
        >
          <FaRegShareSquare className="w-4 h-4 text-red-500 group-hover:text-red-400 transition-transform active:scale-125" />
        </div>
      </div>

      {/* Comment Modal */}
      <CommentModal
        post={post}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCommentSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default PostCard;
