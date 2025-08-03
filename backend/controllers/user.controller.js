import { Aggregate } from "mongoose";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { genSalt } from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }

    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "User not found" });
    }
    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      //Unfollow the User
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      //Follow the User
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      // TODO: notification changes
      //Send notification to the User
      const newNotification = new Notification({
        from: req.user.id,
        to: userToModify._id,
        type: "follow",
      });
      await newNotification.save();
      // TODO: notification changes
      res.status(200).json({ message: "User followed Successfully" });
    }
  } catch (error) {
    console.log("Error in followUnfollow:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const userFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },

      { $sample: { size: 10 } },
    ]);
    const filteredUsers = users.filter(
      (user) => !userFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in getSuggestedUsers: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const updateUser = async (req, res) => {
  const {
    fullName,
    email,
    currentPassword,
    newPassword,
    bio,
    link,
    username,
    profileImg,
    coverImg,
  } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not Found" });

    // Validate password fields
    if (
      (currentPassword && !newPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res
        .status(400)
        .json({ error: "Please provide both current and new password" });
    }

    // If password change is requested
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect password" });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters" });
      }

      const salt = await genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Handle profile image upload
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      const uploaded = await cloudinary.uploader.upload(profileImg);
      user.profileImg = uploaded.secure_url;
    }

    // Handle cover image upload
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      const uploaded = await cloudinary.uploader.upload(coverImg);
      user.coverImg = uploaded.secure_url;
    }

    // Update other fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    if (username && username !== user.username) {
      const usernameTaken = await User.findOne({ username });
      if (usernameTaken) {
        return res
          .status(400)
          .json({ error: "Username already exists. Choose another one." });
      }
    }

    await user.save();
    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.username) {
      return res.status(400).json({ error: "Username already exists" });
    }

    console.error("Error in updateUser:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
