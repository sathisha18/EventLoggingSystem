import express from "express";
import {
  createEvent,
  getEvents,
  searchByDate,
  searchBySourceAppId,
  searchEvents,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", createEvent);
router.post("/search/date-range", searchByDate);
router.post("/search/source-app-id", searchBySourceAppId);
router.get("/", searchEvents);

export default router;
