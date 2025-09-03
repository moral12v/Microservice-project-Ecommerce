import { Request, Response } from 'express';
import { responseWithData, responseWithoutData, errorResponse } from '../utils/response';
import logger from '../utils/logger';
import AzureBlobService from '../services/storageService';

export const imageUploadHandler = async (req: Request, res: Response) => {
  try {
    console.log(req.file)
    if (!req.file) {
      return responseWithoutData(res, 400, false, 'No file found in the request');
    }
    console.log(req.file, "req")
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
