import multer, { MulterError } from "multer";
import { Request } from "express";

const multerUpload = multer({
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: function (
    req: Request,
    file: Express.Multer.File,
    callback: any
  ) {
    const allowedImageTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];
    
    

    if (
      allowedImageTypes.includes(file.mimetype) 
    
    ) {
      console.log(true)
      callback(null, true);
    } else {
      const newError = new MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "File type is incorrect"
      );
      callback(newError, false);
    }
  },
});

const multerPdfUpload = multer({
  limits: {
    fileSize: 1024 * 1024 * 150,
  },
  fileFilter: function (
    req: Request,
    file: Express.Multer.File,
    callback: any
  ) {
    if (file.mimetype === "application/pdf") {
      callback(null, true);
    } else {
      const newError = new MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "File type is incorrect"
      );
      callback(newError, false);
    }
  },
});

const multerExcelUpload = multer({
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: function (
    req: Request,
    file: Express.Multer.File,
    callback: any
  ) {
    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype === "text/csv"
    ) {
      callback(null, true);
    } else {
      const newError = new MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "File type is incorrect"
      );
      callback(newError, false);
    }
  },
});

export { multerUpload, multerPdfUpload, multerExcelUpload };
