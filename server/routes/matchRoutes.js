
const express = require('express');
const { matchJobs } = require('../controllers/matchController');

const router = express.Router();

router.post('/match-jobs', matchJobs);

module.exports = router;
