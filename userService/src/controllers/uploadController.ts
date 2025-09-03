import { Request, Response } from 'express';
import { responseWithData, responseWithoutData, errorResponse } from '../utils/response';
import logger from '../utils/logger';
import AzureBlobService from '../services/storageService';

export const imageUploadHandler = async (req: Request, res: Response) => {
  try {
    // console.log(req.file)
    if (!req.file) {
      return responseWithoutData(res, 400, false, 'No file found in the request');
    }
    // console.log(req.file, "req")
    const fileName = Date.now().toString() + '_' + req.file.originalname;
    
    await AzureBlobService.uploadFile(req.file.buffer, fileName);

    const imageUrl = await AzureBlobService.getBlobUrl(fileName);
    
    console.log(`Image URL: ${imageUrl}`);
    responseWithData(res, 201, true, 'Image Uploaded successfully.', { imageUrl });
    logger.info(`Image uploaded: ${fileName}`);
  } catch (error: any) {
    logger.error(`Error uploading image: ${error.message}`);
    errorResponse(res, error.message || 'Failed to upload image.');
  }
};


export const pdfUploadHandler = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return responseWithoutData(res, 400, false, 'No file found in the request');
    }
    if (req.file.mimetype !== 'application/pdf') {
      return responseWithoutData(res, 400, false, 'Invalid file type. Only PDFs are allowed.');
    }
    const fileName = Date.now().toString() + '_' + req.file.originalname;
    await AzureBlobService.uploadFile(req.file.buffer, fileName);
    const pdfUrl = await AzureBlobService.getBlobUrl(fileName);

    console.log(`PDF URL: ${pdfUrl}`);
    responseWithData(res, 201, true, 'PDF Uploaded successfully.', { pdfUrl });
    logger.info(`PDF uploaded: ${fileName}`);
  } catch (error: any) {
    logger.error(`Error uploading PDF: ${error.message}`);
    errorResponse(res, error.message || 'Failed to upload PDF.');
  }
};

export const excelUploadHandler = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return responseWithoutData(res, 400, false, 'No file found in the request');
    }
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
      "application/vnd.ms-excel", 
      "text/csv" 
    ];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return responseWithoutData(res, 400, false, 'Invalid file type. Only Excel files are allowed.');
    }
    const fileName = Date.now().toString() + '_' + req.file.originalname;
    await AzureBlobService.uploadFile(req.file.buffer, fileName);
    const excelUrl = await AzureBlobService.getBlobUrl(fileName);

    console.log(`Excel URL: ${excelUrl}`);
    responseWithData(res, 201, true, 'Excel file uploaded successfully.', { excelUrl });
    logger.info(`Excel file uploaded: ${fileName}`);
  } catch (error: any) {
    logger.error(`Error uploading Excel file: ${error.message}`);
    errorResponse(res, error.message || 'Failed to upload Excel file.');
  }
};