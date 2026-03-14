/**
 * jdController.js
 * Handles job description text input, parses it using
 * rule-based extraction for role, salary, skills, etc.
 */

const { parseJD } = require('../utils/jdParser');

function processJD(req, res) {
    try {
        const { jdText } = req.body;

        if (!jdText || jdText.trim().length === 0) {
            return res.status(400).json({ error: 'Job description text is required.' });
        }

        // Parse JD using rule-based logic
        const parsed = parseJD(jdText);

        return res.json({
            success: true,
            data: parsed
        });
    } catch (err) {
        console.error('JD processing error:', err.message);
        return res.status(500).json({ error: 'Failed to process job description. ' + err.message });
    }
}

module.exports = { processJD };
