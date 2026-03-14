/**
 * resumeParser.js
 * Rule-based utility to extract name, years of experience,
 * and skills from raw resume text. No AI/LLM is used.
 *
 * Uses the new skillExtractor for robust skill detection.
 */

const { extractSkills } = require('./skillExtractor');

/**
 * Extract the candidate's name.
 * Heuristic: the first non-empty, non-email, non-phone line
 * that looks like a proper name (2-4 capitalised words).
 */
function extractName(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    for (const line of lines) {
        // Skip lines that look like emails, phones, URLs, or very long sentences
        if (/@/.test(line)) continue;
        if (/https?:\/\//.test(line)) continue;
        if (/^\+?\d[\d\s\-()]{7,}$/.test(line)) continue;
        if (line.length > 60) continue;

        // A name is typically 2-4 words, each starting with an uppercase letter
        const namePattern = /^[A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+){1,3}$/;
        if (namePattern.test(line)) {
            return line;
        }
    }

    // Fallback: return the first short line
    const fallback = lines.find(l => l.length > 1 && l.length < 40);
    return fallback || 'Unknown';
}

/**
 * Extract years of experience from resume text.
 * Looks for patterns like "4 years", "3.5 yrs", "2+ years of experience".
 */
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

/**
 * Main parse function — accepts raw PDF text, returns structured data.
 */
function parseResume(text) {
    return {
        name: extractName(text),
        yearsOfExperience: extractExperience(text),
        resumeSkills: extractSkills(text)
    };
}

module.exports = { parseResume };
