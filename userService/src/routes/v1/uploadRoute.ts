import express from "express";

import { validateRequest } from "../../middlewares/validateRequest";
import { excelUploadHandler, imageUploadHandler, pdfUploadHandler } from "../../controllers/uploadController";
import { multerExcelUpload, multerPdfUpload, multerUpload } from "../../middlewares/multerMiddleware";
export const uploaderRoute = express.Router();

uploaderRoute.post("/img", multerUpload.single("image"), imageUploadHandler);
uploaderRoute.post('/pdf', multerPdfUpload.single('pdf'), pdfUploadHandler);
uploaderRoute.post("/excel", multerExcelUpload.single("file"), excelUploadHandler);
