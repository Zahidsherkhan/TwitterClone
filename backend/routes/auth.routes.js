import express from "express";
import signup from "../controllers/Signup.js";
import login from "../controllers/Login.js";
import logout from "../controllers/Logout.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
