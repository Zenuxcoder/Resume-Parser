/**
 * resumeRoutes.js
 * Routes for resume upload and parsing.
 */

const express = require('express');
const multer = require('multer');
const { uploadResume } = require('../controllers/resumeController');

const router = express.Router();

// Store uploads in memory (buffer), accept only PDFs
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed.'));
        }
    }
});

// POST /api/upload-resume
router.post('/upload-resume', upload.single('resume'), uploadResume);

module.exports = router;
