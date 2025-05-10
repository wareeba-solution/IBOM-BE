// src/api/middlewares/fileUpload.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../../utils/error');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Temporary storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

// File filter to only allow CSV and Excel files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only CSV and Excel files are allowed', 400), false);
  }
};

// Create multer instance with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

// Middleware for handling file uploads
const uploadFile = upload.single('file');

const handleFileUpload = (req, res, next) => {
  uploadFile(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer error occurred when uploading
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('File size is too large. Maximum size is 10MB', 400));
      }
      return next(new AppError(err.message, 400));
    } else if (err) {
      // Other error occurred
      return next(err);
    }
    
    // No file uploaded
    if (!req.file) {
      return next(new AppError('Please upload a file', 400));
    }
    
    next();
  });
};

module.exports = {
  handleFileUpload,
};