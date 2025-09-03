import express from "express";
import TranscitionHistoryController from "../../controllers/transicitionHistoryController";
export const transcitionHistoryRoute = express.Router();

transcitionHistoryRoute.post("/", TranscitionHistoryController.createTranscitionHistory);
transcitionHistoryRoute.get("/", TranscitionHistoryController.getAllTranscitionHistory);
transcitionHistoryRoute.get("/:id", TranscitionHistoryController.getTranscitionHistoryById);
transcitionHistoryRoute.delete("/:id", TranscitionHistoryController.deleteTranscitionHistory);
