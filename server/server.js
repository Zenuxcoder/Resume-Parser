/**
 * server.js
 * Express application entry point.
 * Serves static frontend files and mounts API routes.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const resumeRoutes = require('./routes/resumeRoutes');
const jdRoutes = require('./routes/jdRoutes');
const matchRoutes = require('./routes/matchRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve the frontend files (index.html, style.css, script.js)
app.use(express.static(path.join(__dirname, '..')));

// --- API Routes ---
app.use('/api', resumeRoutes);
app.use('/api', jdRoutes);
app.use('/api', matchRoutes);

// --- Error handler for multer / general errors ---
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(400).json({ error: err.message });
});

// --- Start server ---
app.listen(PORT, () => {
    console.log(`Resume Matcher server running at http://localhost:${PORT}`);
});
