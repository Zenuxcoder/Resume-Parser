/**
 * jdRoutes.js
 * Routes for job description processing.
 */

const express = require('express');
const { processJD } = require('../controllers/jdController');

const router = express.Router();

// POST /api/process-jd
router.post('/process-jd', processJD);

module.exports = router;
