import express from "express";
import { driveController } from "../controllers/driveController";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API is up and running" });
});

router.get("/extract", driveController.extractContent);

export default router;
