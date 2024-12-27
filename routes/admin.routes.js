import express from "express";
import {
  addRoom,
  deleteRoom,
  updateRoom,
} from "../controllers/admin.controller.js";
const router = express.Router();
router.post("/add-room", addRoom);
router.patch("/update-room/:id", updateRoom);
router.delete("/delete-room/:id", deleteRoom);
export default router;
