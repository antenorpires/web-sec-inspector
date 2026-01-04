import express from "express";

const router = express.Router();

router.get("/", (_, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

export default router;
