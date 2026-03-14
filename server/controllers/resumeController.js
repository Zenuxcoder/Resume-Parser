
const pdfParse = require('pdf-parse');
const { parseResume } = require('../utils/resumeParser');

async function uploadResume(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded. Please upload a PDF resume.' });
        }

        const pdfData = await pdfParse(req.file.buffer);
        const rawText = pdfData.text;

        if (!rawText || rawText.trim().length === 0) {
            return res.status(400).json({ error: 'Could not extract text from PDF. The file may be image-based.' });
        }

        const parsed = parseResume(rawText);

        return res.json({
            success: true,
            data: parsed
        });
    } catch (err) {
        console.error('Resume upload error:', err.message);
        return res.status(500).json({ error: 'Failed to process resume. ' + err.message });
    }
}

module.exports = { uploadResume };
