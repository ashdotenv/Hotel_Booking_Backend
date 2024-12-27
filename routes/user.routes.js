import express from "express";
import { Logout, updateProfile } from "../controllers/user.controller.js";
import { bookRoom } from "../controllers/room.controller.js";
const router = express.Router();
router.patch("update-profile", updateProfile);
router.post("book-room", bookRoom);
router.get("/logout", Logout);
export default router;
