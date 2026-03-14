
const { extractSkills } = require('./skillExtractor');

function extractName(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    for (const line of lines) {
        if (/@/.test(line)) continue;
        if (/https?:\/\//.test(line)) continue;
        if (/^\+?\d[\d\s\-()]{7,}$/.test(line)) continue;
        if (line.length > 60) continue;

        const namePattern = /^[A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+){1,3}$/;
        if (namePattern.test(line)) {
            return line;
        }
    }

    const fallback = lines.find(l => l.length > 1 && l.length < 40);
    return fallback || 'Unknown';
}

function extractExperience(text) {
    const patterns = [
        /(\d+\.?\d*)\+?\s*(?:years?|yrs?)[\s\w]*(?:of)?\s*(?:experience|exp)/i,
        /(?:experience|exp)[\s:]*(\d+\.?\d*)\+?\s*(?:years?|yrs?)/i,
        /(\d+\.?\d*)\+?\s*(?:years?|yrs?)/i
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            return parseFloat(match[1]);
        }
    }

    return 0;
}

function parseResume(text) {
    return {
        name: extractName(text),
        yearsOfExperience: extractExperience(text),
        resumeSkills: extractSkills(text)
    };
}

module.exports = { parseResume };
