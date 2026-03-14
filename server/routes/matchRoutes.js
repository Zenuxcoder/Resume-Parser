/**
 * matchRoutes.js
 * Routes for job matching.
 */

const express = require('express');
const { matchJobs } = require('../controllers/matchController');

const router = express.Router();

// POST /api/match-jobs
router.post('/match-jobs', matchJobs);

module.exports = router;
