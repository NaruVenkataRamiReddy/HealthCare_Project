# File Upload Implementation Guide

Complete guide for handling file uploads with Multer - supporting profile pictures, licenses, prescriptions, and test reports.

---

## Table of Contents

1. [Multer Configuration](#1-multer-configuration)
2. [Storage Setup](#2-storage-setup)
3. [Upload Controller](#3-upload-controller)
4. [Upload Routes](#4-upload-routes)
5. [Frontend Integration](#5-frontend-integration)
6. [Security & Validation](#6-security--validation)
7. [Image Optimization](#7-image-optimization)

---

## 1. Multer Configuration

### Install Dependencies

```bash
npm install multer sharp
```

### config/multer.js

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories if they don't exist
const uploadDirs = [
  './uploads/profiles',
  './uploads/licenses',
  './uploads/prescriptions',
  './uploads/reports'
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, PDF, and WEBP are allowed.'));
  }
};

// Storage configuration for profile pictures
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/profiles');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage configuration for licenses
const licenseStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/licenses');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'license-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage configuration for prescriptions
const prescriptionStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/prescriptions');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'prescription-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage configuration for test reports
const reportStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/reports');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'report-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer instances
const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const imageFilter = /jpeg|jpg|png|webp/;
    const extname = imageFilter.test(path.extname(file.originalname).toLowerCase());
    const mimetype = imageFilter.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for profile pictures'));
    }
  }
});

const uploadLicense = multer({
  storage: licenseStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

const uploadPrescription = multer({
  storage: prescriptionStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

const uploadReport = multer({
  storage: reportStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const pdfFilter = /pdf/;
    const extname = pdfFilter.test(path.extname(file.originalname).toLowerCase());
    const mimetype = pdfFilter.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for reports'));
    }
  }
});

module.exports = {
  uploadProfile,
  uploadLicense,
  uploadPrescription,
  uploadReport
};
```

---

## 2. Storage Setup

### Directory Structure

```
uploads/
├── profiles/           # Profile pictures
├── licenses/           # License certificates (doctors, diagnostic, medical shops)
├── prescriptions/      # Patient prescriptions
└── reports/           # Diagnostic test reports
```

### Permissions (Linux/Mac)

```bash
chmod 755 uploads
chmod 755 uploads/profiles
chmod 755 uploads/licenses
chmod 755 uploads/prescriptions
chmod 755 uploads/reports
```

---

## 3. Upload Controller

### controllers/upload.controller.js

```javascript
const db = require('../config/database');
const ResponseHandler = require('../utils/responseHandler');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

class UploadController {
  /**
   * Upload Profile Picture
   * POST /api/uploads/profile-picture
   */
  static async uploadProfilePicture(req, res) {
    try {
      if (!req.file) {
        return ResponseHandler.error(res, 'No file uploaded', 400);
      }

      const userId = req.user.userId;
      const role = req.user.role;
      const filePath = `/uploads/profiles/${req.file.filename}`;

      // Optimize image
      const optimizedPath = await UploadController.optimizeImage(req.file.path);

      // Update database based on role
      let updateQuery;
      if (role === 'patient') {
        updateQuery = 'UPDATE patients SET profile_picture = ? WHERE user_id = ?';
      } else if (role === 'doctor') {
        updateQuery = 'UPDATE doctors SET profile_picture = ? WHERE user_id = ?';
      } else if (role === 'diagnostic') {
        updateQuery = 'UPDATE diagnostic_centers SET profile_picture = ? WHERE user_id = ?';
      } else if (role === 'medical_shop') {
        updateQuery = 'UPDATE medical_shops SET profile_picture = ? WHERE user_id = ?';
      }

      await db.query(updateQuery, [filePath, userId]);

      return ResponseHandler.success(res, {
        fileUrl: filePath
      }, 'Profile picture uploaded successfully');
    } catch (error) {
      console.error('Upload profile picture error:', error);
      return ResponseHandler.error(res, 'Failed to upload profile picture', 500);
    }
  }

  /**
   * Upload License Certificate
   * POST /api/uploads/license
   */
  static async uploadLicense(req, res) {
    try {
      if (!req.file) {
        return ResponseHandler.error(res, 'No file uploaded', 400);
      }

      const userId = req.user.userId;
      const role = req.user.role;
      const filePath = `/uploads/licenses/${req.file.filename}`;

      // Update database based on role
      let updateQuery;
      if (role === 'doctor') {
        updateQuery = 'UPDATE doctors SET license_certificate = ? WHERE user_id = ?';
      } else if (role === 'diagnostic') {
        updateQuery = 'UPDATE diagnostic_centers SET license_certificate = ? WHERE user_id = ?';
      } else if (role === 'medical_shop') {
        updateQuery = 'UPDATE medical_shops SET license_certificate = ? WHERE user_id = ?';
      } else {
        return ResponseHandler.error(res, 'Invalid role for license upload', 403);
      }

      await db.query(updateQuery, [filePath, userId]);

      return ResponseHandler.success(res, {
        fileUrl: filePath
      }, 'License certificate uploaded successfully');
    } catch (error) {
      console.error('Upload license error:', error);
      return ResponseHandler.error(res, 'Failed to upload license', 500);
    }
  }

  /**
   * Upload Prescription
   * POST /api/uploads/prescription
   */
  static async uploadPrescription(req, res) {
    try {
      if (!req.file) {
        return ResponseHandler.error(res, 'No file uploaded', 400);
      }

      const filePath = `/uploads/prescriptions/${req.file.filename}`;

      return ResponseHandler.success(res, {
        fileUrl: filePath
      }, 'Prescription uploaded successfully');
    } catch (error) {
      console.error('Upload prescription error:', error);
      return ResponseHandler.error(res, 'Failed to upload prescription', 500);
    }
  }

  /**
   * Upload Test Report
   * POST /api/uploads/test-report
   */
  static async uploadTestReport(req, res) {
    try {
      if (!req.file) {
        return ResponseHandler.error(res, 'No file uploaded', 400);
      }

      const { bookingId } = req.body;
      const userId = req.user.userId;
      const filePath = `/uploads/reports/${req.file.filename}`;

      // Verify the booking belongs to the diagnostic center
      const [bookings] = await db.query(
        `SELECT db.booking_id FROM diagnostic_bookings db
         JOIN diagnostic_centers dc ON db.center_id = dc.center_id
         WHERE db.booking_id = ? AND dc.user_id = ?`,
        [bookingId, userId]
      );

      if (bookings.length === 0) {
        return ResponseHandler.error(res, 'Booking not found or unauthorized', 404);
      }

      // Update booking with report
      await db.query(
        `UPDATE diagnostic_bookings 
         SET report_file = ?, report_status = 'ready' 
         WHERE booking_id = ?`,
        [filePath, bookingId]
      );

      return ResponseHandler.success(res, {
        fileUrl: filePath,
        bookingId: bookingId
      }, 'Test report uploaded successfully');
    } catch (error) {
      console.error('Upload test report error:', error);
      return ResponseHandler.error(res, 'Failed to upload test report', 500);
    }
  }

  /**
   * Delete File
   * DELETE /api/uploads/:filename
   */
  static async deleteFile(req, res) {
    try {
      const { filename } = req.params;
      const { type } = req.query; // profile, license, prescription, report

      let filePath;
      if (type === 'profile') {
        filePath = path.join(__dirname, '../uploads/profiles', filename);
      } else if (type === 'license') {
        filePath = path.join(__dirname, '../uploads/licenses', filename);
      } else if (type === 'prescription') {
        filePath = path.join(__dirname, '../uploads/prescriptions', filename);
      } else if (type === 'report') {
        filePath = path.join(__dirname, '../uploads/reports', filename);
      } else {
        return ResponseHandler.error(res, 'Invalid file type', 400);
      }

      // Delete file
      await fs.unlink(filePath);

      return ResponseHandler.success(res, null, 'File deleted successfully');
    } catch (error) {
      console.error('Delete file error:', error);
      return ResponseHandler.error(res, 'Failed to delete file', 500);
    }
  }

  // ============ Helper Methods ============

  /**
   * Optimize image using sharp
   */
  static async optimizeImage(filePath) {
    try {
      const optimizedPath = filePath.replace(path.extname(filePath), '_optimized.jpg');

      await sharp(filePath)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 85 })
        .toFile(optimizedPath);

      // Delete original file
      await fs.unlink(filePath);

      return optimizedPath;
    } catch (error) {
      console.error('Image optimization error:', error);
      return filePath; // Return original if optimization fails
    }
  }

  /**
   * Get file size
   */
  static async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Validate file type
   */
  static isValidFileType(filename, allowedTypes) {
    const ext = path.extname(filename).toLowerCase();
    return allowedTypes.includes(ext);
  }
}

module.exports = UploadController;
```

---

## 4. Upload Routes

### routes/upload.routes.js

```javascript
const express = require('express');
const router = express.Router();
const UploadController = require('../controllers/upload.controller');
const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { 
  uploadProfile, 
  uploadLicense, 
  uploadPrescription, 
  uploadReport 
} = require('../config/multer');

// Profile picture (all authenticated users)
router.post(
  '/profile-picture', 
  authenticateToken, 
  uploadProfile.single('file'),
  UploadController.uploadProfilePicture
);

// License certificate (doctors, diagnostic centers, medical shops)
router.post(
  '/license', 
  authenticateToken,
  roleCheck('doctor', 'diagnostic', 'medical_shop'),
  uploadLicense.single('file'),
  UploadController.uploadLicense
);

// Prescription (patients only)
router.post(
  '/prescription', 
  authenticateToken,
  roleCheck('patient'),
  uploadPrescription.single('file'),
  UploadController.uploadPrescription
);

// Test report (diagnostic centers only)
router.post(
  '/test-report', 
  authenticateToken,
  roleCheck('diagnostic'),
  uploadReport.single('file'),
  UploadController.uploadTestReport
);

// Delete file
router.delete(
  '/:filename',
  authenticateToken,
  UploadController.deleteFile
);

module.exports = router;
```

---

## 5. Frontend Integration

### React Example - Profile Picture Upload

```javascript
import React, { useState } from 'react';
import axios from 'axios';

const ProfilePictureUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Validate file
    if (!selectedFile) return;
    
    if (!selectedFile.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        '/api/uploads/profile-picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      alert('Profile picture uploaded successfully!');
      console.log('File URL:', response.data.data.fileUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
      />
      
      {preview && (
        <div>
          <img src={preview} alt="Preview" style={{ maxWidth: '200px' }} />
        </div>
      )}

      <button 
        onClick={handleUpload} 
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default ProfilePictureUpload;
```

### React Example - PDF Upload (Prescription)

```javascript
import React, { useState } from 'react';
import axios from 'axios';

const PrescriptionUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    
    // Validate PDF
    if (selectedFile.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        '/api/uploads/prescription',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const fileUrl = response.data.data.fileUrl;
      onUploadSuccess(fileUrl);
      alert('Prescription uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload prescription');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept=".pdf" 
        onChange={handleFileChange}
      />
      
      {file && <p>Selected: {file.name}</p>}

      <button 
        onClick={handleUpload} 
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Prescription'}
      </button>
    </div>
  );
};

export default PrescriptionUpload;
```

---

## 6. Security & Validation

### File Type Validation

```javascript
// Backend validation in multer config
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};
```

### File Size Limits

```javascript
// In multer config
limits: {
  fileSize: 10 * 1024 * 1024, // 10MB
  files: 1 // Max 1 file per request
}
```

### Sanitize Filenames

```javascript
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase();
};
```

### Prevent Directory Traversal

```javascript
const path = require('path');

// Never trust user input for file paths
const safePath = path.normalize(userProvidedPath).replace(/^(\.\.[\/\\])+/, '');
```

### Virus Scanning (Optional)

```bash
npm install clamav.js
```

```javascript
const clamav = require('clamav.js');

const scanFile = async (filePath) => {
  const scanner = clamav.createScanner(3310, '127.0.0.1');
  const result = await scanner.scanFile(filePath);
  return result.isInfected;
};
```

---

## 7. Image Optimization

### Using Sharp for Image Processing

```javascript
const sharp = require('sharp');

// Resize and compress
await sharp(inputPath)
  .resize(800, 800, {
    fit: 'inside',
    withoutEnlargement: true
  })
  .jpeg({ quality: 85 })
  .toFile(outputPath);

// Create thumbnail
await sharp(inputPath)
  .resize(150, 150, {
    fit: 'cover'
  })
  .jpeg({ quality: 80 })
  .toFile(thumbnailPath);

// Convert to WebP
await sharp(inputPath)
  .webp({ quality: 80 })
  .toFile(outputPath.replace('.jpg', '.webp'));
```

---

## Production Considerations

### 1. Use Cloud Storage (S3, Cloudinary, etc.)

For production, consider using cloud storage instead of local storage:

```bash
npm install aws-sdk
# or
npm install cloudinary
```

### 2. CDN Integration

Serve uploaded files through a CDN for better performance.

### 3. Backup Strategy

Regular backups of the uploads directory:

```bash
# Cron job for daily backup
0 2 * * * tar -czf /backups/uploads_$(date +\%Y\%m\%d).tar.gz /path/to/uploads
```

### 4. Storage Limits

Implement storage quotas per user/organization.

### 5. File Cleanup

Remove old/unused files periodically:

```javascript
// Cleanup files older than 30 days
const cleanupOldFiles = async () => {
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  const files = await fs.readdir('./uploads/prescriptions');
  
  for (const file of files) {
    const stats = await fs.stat(`./uploads/prescriptions/${file}`);
    if (stats.mtimeMs < thirtyDaysAgo) {
      await fs.unlink(`./uploads/prescriptions/${file}`);
    }
  }
};
```

---

## Error Handling

### Multer Error Handler

```javascript
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: { message: 'File too large (max 10MB)' }
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: { message: 'Unexpected file field' }
      });
    }
  }
  next(error);
});
```

---

## Testing

### Test Upload with Postman

1. **Select POST method**
2. **URL**: `http://localhost:5000/api/uploads/profile-picture`
3. **Headers**: `Authorization: Bearer <token>`
4. **Body**: 
   - Select `form-data`
   - Key: `file` (change type to File)
   - Value: Select your file

### Test with cURL

```bash
curl -X POST \
  http://localhost:5000/api/uploads/profile-picture \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'file=@/path/to/image.jpg'
```

---

## Complete Example Flow

1. **User selects file in frontend**
2. **Frontend validates file (type, size)**
3. **Frontend sends file via FormData**
4. **Backend multer receives file**
5. **Backend validates file again**
6. **Backend saves file to disk**
7. **Backend optimizes image (if image)**
8. **Backend updates database with file path**
9. **Backend returns file URL to frontend**
10. **Frontend displays success message**
