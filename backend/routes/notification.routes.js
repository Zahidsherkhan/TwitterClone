import express from "express";
import { getNotifications } from "../controllers/notification.controller.js";
import { deleteNotification } from "../controllers/notification.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotification);

export default router;
