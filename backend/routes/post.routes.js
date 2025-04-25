import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost } from "../controllers/post.controller.js";
import { deletePost } from "../controllers/post.controller.js";
import { commentOnPost } from "../controllers/post.controller.js";
import { likeUnlikePost } from "../controllers/post.controller.js";
import { getAllPosts } from "../controllers/post.controller.js";
import { getlikedPosts } from "../controllers/post.controller.js";
import { getFollowingPosts } from "../controllers/post.controller.js";
import { getUserPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getlikedPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/delete/:id", protectRoute, deletePost);

export default router;
