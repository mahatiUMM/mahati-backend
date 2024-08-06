import multer from "multer";
import crypto from "crypto";
import path from "path";
import { promisify } from 'util';
import fs from 'fs';

export const removeFile = promisify(fs.unlink);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./storage/uploads");
  },
  filename: function (req, file, cb) {
    const hash = crypto
      .createHash("sha256")
      .update(Date.now().toString())
      .digest("hex");
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${hash}${ext}`);
  },
});

const filter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG and PNG files are allowed."));
  }
};

const filterPdf = (req, file, cb) => {
  const allowedMimes = ["application/pdf"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF files are allowed."));
  }
}

/**
 * The `imageUploader` function is a Multer middleware that handles file uploads.
 * @returns a Multer middleware.
 */
export const imageUploader = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: filter,
});

/**
 * The `pdfUploader` function is a Multer middleware that handles PDF file uploads.
 * @returns a Multer middleware.
 */

export const pdfUploader = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: filterPdf,
});