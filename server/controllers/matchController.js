
const { matchResumeToJobs } = require('../utils/matcher');

function matchJobs(req, res) {
    try {
        const { resumeData, jdData } = req.body;

        if (!resumeData || !resumeData.resumeSkills) {
            return res.status(400).json({ error: 'Resume data with skills is required.' });
        }

        if (!jdData || !Array.isArray(jdData) || jdData.length === 0) {
            return res.status(400).json({ error: 'At least one job description is required.' });
        }

        const result = matchResumeToJobs(resumeData, jdData);

        return res.json({
            success: true,
            data: result
        });
    } catch (err) {
        console.error('Matching error:', err.message);
        return res.status(500).json({ error: 'Failed to match jobs. ' + err.message });
    }
}

module.exports = { matchJobs };
