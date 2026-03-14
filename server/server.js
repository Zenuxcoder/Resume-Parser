
const express = require('express');
const cors = require('cors');
const path = require('path');

const resumeRoutes = require('./routes/resumeRoutes');
const jdRoutes = require('./routes/jdRoutes');
const matchRoutes = require('./routes/matchRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..')));

app.use('/api', resumeRoutes);
app.use('/api', jdRoutes);
app.use('/api', matchRoutes);

app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(400).json({ error: err.message });
});

module.exports = app;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Resume Matcher server running at http://localhost:${PORT}`);
    });
}
