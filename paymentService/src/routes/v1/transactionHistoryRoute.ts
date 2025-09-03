import express from "express";
import TranscitionHistoryController from "../../controllers/transactionHistoryController";
import { merchantAuthentication } from "../../middlewares/validateMerchant";
import { vendorAuthentication } from "../../middlewares/vendorAunthetication";
export const transcitionHistoryRoute = express.Router();

transcitionHistoryRoute.post("/", TranscitionHistoryController.createTranscitionHistory);
transcitionHistoryRoute.get("/", TranscitionHistoryController.getAllTranscitionHistory);
transcitionHistoryRoute.get("/:id", TranscitionHistoryController.getTranscitionHistoryById);
transcitionHistoryRoute.patch("/", TranscitionHistoryController.updateTranscitionHistory);
transcitionHistoryRoute.get('/merchant/transactions', merchantAuthentication, TranscitionHistoryController.getTransactionHistoryByMerchantId);
transcitionHistoryRoute.get('/aggregator/transactions',  TranscitionHistoryController.getTransactionHistoryByMerchantIdV2);