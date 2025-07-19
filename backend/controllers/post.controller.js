import mongoose from "mongoose";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";

// Create Post
export const createPost = async (req, res) => {
  try {
    const { text, img: rawImg } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!text && !rawImg) {
      return res.status(400).json({ error: "Please provide text or image" });
    }

    let img = rawImg;
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      img,
      text,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in deletePost:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ error: "Please provide text" });
    }

    const post = await Post.findById(postId).populate("user");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    // Create notification for post owner (if commenter is not the owner)
    if (userId.toString() !== post.user._id.toString()) {
      await Notification.create({
        type: "comment",
        from: userId,
        to: post.user._id,
        post: post._id,
      });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in commentOnPost:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Like or Unlike Post
export const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });

      //like seeing function
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
      // end of like seeing funtion

      return res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like
      post.likes.push(userId);

      //like seeing function
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      // end of like seeing function2

      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();

      return res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.error("Error in likeUnlikePost:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all Posts
export const getAllPosts = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      })
      .lean();

    const updatedPosts = posts.map((post) => ({
      ...post,
      isLikedByMe: post.likes.some(
        (id) => id.toString() === currentUserId.toString()
      ),
    }));

    res.status(200).json(updatedPosts);
  } catch (error) {
    console.error("Error in getAllPosts:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get liked Posts
export const getlikedPosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts", error);
    res.status(400).json({ error: "Server Internal Error" });
  }
};

// Get the Posts of the Following Users
export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userFollowing = user.following;

    const followingPosts = await Post.find({ user: { $in: userFollowing } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(followingPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts", error);
    res.status(400).json({ error: "Internal Server Error" });
  }
};

// Get the User Posts

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({ error: "User not found" });
    }
    const userPosts = await Post.find({ user: user._id })
      .sort({
        createAt: -1,
      })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(userPosts);
  } catch (error) {
    console.log("Error in getUserPosts ", error);
    res.status(400).json({ error: "Internal Server Error" });
  }
};
