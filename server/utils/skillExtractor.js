
const dictionary = require('../data/skills-dictionary.json');

const singleWordSet = new Set(dictionary.singleWord.map(s => s.toLowerCase()));

const multiWordList = [...dictionary.multiWord]
    .map(s => s.toLowerCase())
    .sort((a, b) => b.length - a.length);

const multiWordRegexes = multiWordList.map(skill => ({
    skill,
    regex: new RegExp(`(?:^|[\\s,;|/()\\[\\]{}"'!?\\.>~\\-])(?:${escapeRegex(skill)})(?:$|[\\s,;|/()\\[\\]{}"'!?\\.<~\\-])`, 'i')
}));

function extractSkills(text) {
    if (!text || typeof text !== 'string') return [];

    const normalised = normaliseText(text);
    const found = new Set();

    for (const { skill, regex } of multiWordRegexes) {
        if (regex.test(normalised)) {
            found.add(skill);
        }
    }

    const tokens = tokenise(normalised);

    for (const token of tokens) {
        if (singleWordSet.has(token)) {
            found.add(token);
        }

        const cleanToken = token.replace(/^[^a-z0-9+#]+|[^a-z0-9+#]+$/g, '');
        if (cleanToken && cleanToken !== token && singleWordSet.has(cleanToken)) {
            found.add(cleanToken);
        }

        const stripped = cleanToken.replace(/\d+(\.\d+)*$/, '');
        if (stripped && stripped !== cleanToken && singleWordSet.has(stripped)) {
            found.add(stripped);
        }
    }

    if (/\bc\+\+\b/i.test(text)) found.add('c++');
    if (/\bc#\b/i.test(text)) found.add('c#');
    if (/\bf#\b/i.test(text)) found.add('f#');
    if (/\.net\b/i.test(text)) found.add('.net core');
    if (/node\.?js/i.test(text)) found.add('node.js');
    if (/ci\s*\/?\s*cd/i.test(text)) found.add('ci/cd');
    if (/rest\s*(?:ful)?\s*api/i.test(text)) found.add('rest api');

    return [...found];
}

function normaliseText(text) {
    return text
        .toLowerCase()
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
        .trim();
}

function tokenise(text) {
    const cleaned = text
        .replace(/[,;:|()\[\]{}"'`!?@$%^&*=<>~\\]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return cleaned.split(' ').filter(t => t.length > 0);
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { extractSkills };
