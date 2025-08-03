import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

import PostCard from "../components/PostCard";
import PostSkeleton from "../components/PostSkeleton";
import CommentModal from "../components/CommentModal";
import ShareModal from "../components/ShareModal";
import FeedSwitcher from "../components/FeedSwitcher";
import EditProfileModal from "../components/EditProfileModal";
import { formatMemberSinceDate } from "../../util/date";

import { useAuthUser } from "../Hooks/useAuthUser";
import { usePostActions } from "../Hooks/usePostActions";
import useFollow from "../Hooks/useFollow";
import toast from "react-hot-toast";

import { getUserPosts, getUserLikedPosts } from "../api/posts";

const fetchUserData = async (username) => {
  const res = await fetch(`/api/users/profile/${username}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

const Profile = () => {
  const queryClient = useQueryClient();
  const authUser = useAuthUser();
  const { username } = useParams();
  const [feedType, setFeedType] = useState("posts");
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [activeSharePostId, setActiveSharePostId] = useState(null);
  const [likeLoadingPostId, setLikeLoadingPostId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);

  const isOwnProfile = authUser?.username === username;
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const {
    data: user,
    isLoading: loadingUser,
    isError: errorUser,
  } = useQuery({
    queryKey: ["user", username],
    queryFn: () => fetchUserData(username),
    enabled: !!username,
  });

  const {
    data: userPosts = [],
    isLoading: loadingUserPosts,
    isError: errorUserPosts,
  } = useQuery({
    queryKey: ["posts", "user", username],
    queryFn: () => getUserPosts(username),
    enabled: !!username,
  });

  const {
    data: likedPosts = [],
    isLoading: loadingLikedPosts,
    isError: errorLikedPosts,
  } = useQuery({
    queryKey: ["posts", "likes", authUser?._id],
    queryFn: () => getUserLikedPosts(authUser._id),
    enabled: feedType === "likes" && !!authUser?._id,
  });

  const [localPosts, setLocalPosts] = useState([]);

  useEffect(() => {
    const postsToRender = feedType === "likes" ? likedPosts : userPosts;
    if (postsToRender && postsToRender.length !== localPosts.length) {
      setLocalPosts(postsToRender);
    }
  }, [feedType, userPosts, likedPosts]);

  const { handleLikePost, handleDeletePost, handleCommentSubmit } =
    usePostActions(authUser, localPosts, setLocalPosts);

  const handleCommentOpen = (postId) => setActiveCommentPostId(postId);

  const isLoading = feedType === "likes" ? loadingLikedPosts : loadingUserPosts;
  const isError = feedType === "likes" ? errorLikedPosts : errorUserPosts;

  const { followMutation, isPending: followPending } = useFollow();
  const isFollowing = user?.followers?.includes(authUser?._id);

  // Handle Image Update
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "cover") {
        setCoverImg(reader.result); // base64 string
      } else {
        setProfileImg(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const { mutate: updateImage, isPending: updateImagePending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/users/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...(coverImg && { coverImg }),
            ...(profileImg && { profileImg }),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to update image 😬");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Profile Image Updated 😄");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({
          queryKey: ["user", authUser.username],
        }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (loadingUser) {
    return (
      <p className="text-center mt-6 text-gray-400">Loading profile... 🌀</p>
    );
  }

  if (errorUser || !user) {
    return (
      <p className="text-center mt-6 text-red-400">Failed to load user ❌</p>
    );
  }

  return (
    <section className="max-w-xl w-full mx-auto px-4 mt-4">
      {/* COVER IMAGE */}
      <div className="relative h-36 bg-gray-200 rounded-b-md overflow-hidden">
        <img
          src={user.coverImg || "/bg-gray.jpg"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {isOwnProfile && (
          <>
            <button
              className="absolute top-2 right-2 bg-white px-2 py-1 text-xs rounded shadow cursor-pointer"
              onClick={() => coverInputRef.current.click()}
            >
              ✏️ Edit Cover
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={coverInputRef}
              onChange={(e) => handleImageChange(e, "cover")}
            />
          </>
        )}
      </div>

      {/* PROFILE IMAGE */}
      <div className="relative w-24 h-24 -mt-12 ml-4 border-4 border-white rounded-full overflow-hidden">
        <img
          src={user.profileImg || "/avatar1.svg"}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
        {isOwnProfile && (
          <>
            <button
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer"
              onClick={() => profileInputRef.current.click()}
            >
              ✏️
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={profileInputRef}
              onChange={(e) => handleImageChange(e, "profile")}
            />
          </>
        )}
      </div>

      {/* USER INFO */}
      <div className="px-4 mt-2">
        <h2 className="text-lg font-bold">{user.fullName}</h2>
        <p className="text-gray-500">@{user.username}</p>
        <p className="mt-1">{user.bio || "No bio yet 🐣"}</p>
        <div className="mt-2 flex items-center gap-4">
          <span>{user.followers.length} Followers 👥</span>
          <span>{user.following.length} Following 🧭</span>
        </div>

        <div className="mt-1 flex items-center text-gray-500 text-sm gap-1">
          <span>📅</span>
          <span>{formatMemberSinceDate(user.createdAt)}</span>
        </div>

        {/* Edit or Follow Button */}
        <div className="mt-4">
          {(coverImg || profileImg) && (
            <button onClick={async () => await updateImage()}>
              {updateImagePending ? "Updating..." : "Update"}
            </button>
          )}
          {isOwnProfile ? (
            <button
              className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer hover:bg-red-600 mb-4 text-[12px]"
              onClick={() => setEditModalOpen(true)}
            >
              Edit Profile
            </button>
          ) : (
            <button
              className={`${
                isFollowing
                  ? "bg-red-500 text-white mb-4 text-[12px]"
                  : "bg-red-500 text-white mb-4 text-[12px]"
              } px-4 py-1 rounded hover:opacity-90 cursor-pointer`}
              onClick={() =>
                followMutation({
                  userId: user._id,
                  username: user.username,
                  followerId: authUser._id,
                })
              }
              disabled={followPending}
            >
              {followPending ? "⏳" : isFollowing ? "Unfollow" : " Follow"}
            </button>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <EditProfileModal user={user} onClose={() => setEditModalOpen(false)} />
      )}

      {/* FEED SWITCHER */}
      <FeedSwitcher
        feedType={feedType}
        setFeedType={setFeedType}
        tabs={[
          { label: "Posts 📝", value: "posts" },
          { label: "Likes ❤️", value: "likes" },
        ]}
      />

      {/* POSTS */}
      {isLoading ? (
        <div className="mt-6 flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <p className="text-center text-red-400 mt-6">Failed to load posts.</p>
      ) : localPosts.length === 0 ? (
        <p className="text-center text-gray-400 mt-6">No posts to show 📭</p>
      ) : (
        localPosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            authUserId={authUser?._id}
            likeLoadingId={likeLoadingPostId}
            onLike={(id) => handleLikePost(id, setLikeLoadingPostId)}
            onShare={setActiveSharePostId}
            onDelete={handleDeletePost}
            onCommentSubmit={handleCommentSubmit}
            onCommentOpen={handleCommentOpen}
          />
        ))
      )}

      {/* MODALS */}
      {activeCommentPostId && (
        <CommentModal
          postId={activeCommentPostId}
          onClose={() => setActiveCommentPostId(null)}
          onSubmit={handleCommentSubmit}
        />
      )}

      {activeSharePostId && (
        <ShareModal
          postId={activeSharePostId}
          onClose={() => setActiveSharePostId(null)}
        />
      )}
    </section>
  );
};

export default Profile;
