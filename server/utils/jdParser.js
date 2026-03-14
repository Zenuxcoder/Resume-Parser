
const { extractSkills } = require('./skillExtractor');

let jobIdCounter = 1000;

function extractRole(text) {
    const patterns = [
        /(?:role|position|job\s*title|title)\s*[:–-]\s*(.+)/i,
        /(?:hiring|looking\s+for)\s+(?:a|an)\s+(.+?)(?:\.|,|\n|$)/i
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            return match[1].trim().substring(0, 80);
        }
    }

    const firstLine = text.split('\n').map(l => l.trim()).find(l => l.length > 2 && l.length < 80);
    return firstLine || 'Unspecified Role';
}

function extractSalary(text) {
    const patterns = [
        /(\d+\.?\d*)\s*lpa/i,
        /\$[\d,]+\s*[-–]\s*\$[\d,]+/,
        /\$[\d,]+(?:\/\s*(?:year|yr|annum|annually))?/i,
        /\$\d+k/i,
        /₹[\d,]+(?:\s*(?:per\s*annum|p\.?a\.?|\/\s*year))?/i,
        /(?:salary|compensation|ctc|package)\s*[:–-]\s*([^\n]+)/i
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            return match[0].trim();
        }
    }

    return null;
}

function extractJDSkills(text) {
    const allSkills = extractSkills(text);

    const optionalSection = text.match(
        /(?:nice\s*to\s*have|optional|preferred|bonus|good\s*to\s*have)[:\s]*([\s\S]*?)(?:\n\s*\n|required|must\s*have|$)/i
    );

    let requiredSkills = allSkills;
    let optionalSkills = [];

    if (optionalSection) {
        const optionalText = optionalSection[1];
        const optionalMatches = new Set(extractSkills(optionalText).map(s => s.toLowerCase()));

        optionalSkills = allSkills.filter(s => optionalMatches.has(s.toLowerCase()));
        requiredSkills = allSkills.filter(s => !optionalMatches.has(s.toLowerCase()));
    }

    return { requiredSkills, optionalSkills };
}

function extractAboutRole(text) {
    const patterns = [
        /(?:about\s*(?:the)?\s*role|description|responsibilities|overview)\s*[:–-]?\s*([\s\S]*?)(?:\n\s*\n|requirements|qualifications|skills|$)/i
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match[1].trim().length > 10) {
            return match[1].trim().substring(0, 500);
        }
    }

    return text.trim().substring(0, 200);
}

function parseJD(text) {
    jobIdCounter++;
    const { requiredSkills, optionalSkills } = extractJDSkills(text);

    return {
        jobId: `JD-${jobIdCounter}`,
        role: extractRole(text),
        salary: extractSalary(text),
        requiredSkills,
        optionalSkills,
        aboutRole: extractAboutRole(text)
    };
}

module.exports = { parseJD };
