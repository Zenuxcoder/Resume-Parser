/**
 * skillExtractor.js
 *
 * Robust technology/skill detection using a large predefined dictionary.
 * Handles multi-word skills (e.g. "spring boot", "machine learning"),
 * normalises text, and uses Sets for fast lookups.
 *
 * No AI/LLM — pure regex + keyword matching.
 */

const dictionary = require('../data/skills-dictionary.json');

// ── Build lookup structures once at startup ──────────────────────────
// Single-word skills stored in a Set (lowercase) for O(1) lookup
const singleWordSet = new Set(dictionary.singleWord.map(s => s.toLowerCase()));

// Multi-word skills sorted longest-first so we match the most specific phrase
const multiWordList = [...dictionary.multiWord]
    .map(s => s.toLowerCase())
    .sort((a, b) => b.length - a.length);

// Pre-compiled regexes for each multi-word skill (word-boundary aware)
const multiWordRegexes = multiWordList.map(skill => ({
    skill,
    regex: new RegExp(`(?:^|[\\s,;|/()\\[\\]{}"'!?\\.>~\\-])(?:${escapeRegex(skill)})(?:$|[\\s,;|/()\\[\\]{}"'!?\\.<~\\-])`, 'i')
}));

/**
 * Extract all technology skills from a block of text.
 *
 * @param {string} text  — raw text (resume or JD)
 * @returns {string[]}   — deduplicated list of matched skills (original casing from dictionary)
 */
function extractSkills(text) {
    if (!text || typeof text !== 'string') return [];

    const normalised = normaliseText(text);
    const found = new Set();

    // ── 1) Multi-word matches first (longest match wins) ───────────
    for (const { skill, regex } of multiWordRegexes) {
        if (regex.test(normalised)) {
            found.add(skill);
        }
    }

    // ── 2) Single-word matches via tokenisation ────────────────────
    const tokens = tokenise(normalised);

    for (const token of tokens) {
        if (singleWordSet.has(token)) {
            found.add(token);
        }

        // Clean off any trailing or leading punctuation (except +, # which are part of c++, c#)
        const cleanToken = token.replace(/^[^a-z0-9+#]+|[^a-z0-9+#]+$/g, '');
        if (cleanToken && cleanToken !== token && singleWordSet.has(cleanToken)) {
            found.add(cleanToken);
        }

        // Handle tokens with version suffixes: "python3" → "python"
        const stripped = cleanToken.replace(/\d+(\.\d+)*$/, '');
        if (stripped && stripped !== cleanToken && singleWordSet.has(stripped)) {
            found.add(stripped);
        }
    }

    // ── 3) Special-case detections ─────────────────────────────────
    // "C++" won't survive normal tokenisation
    if (/\bc\+\+\b/i.test(text)) found.add('c++');
    // "C#" detection
    if (/\bc#\b/i.test(text)) found.add('c#');
    // "F#" detection
    if (/\bf#\b/i.test(text)) found.add('f#');
    // ".NET" detection
    if (/\.net\b/i.test(text)) found.add('.net core');
    // "Node.js" explicit
    if (/node\.?js/i.test(text)) found.add('node.js');
    // CI/CD
    if (/ci\s*\/?\s*cd/i.test(text)) found.add('ci/cd');
    // REST API variations
    if (/rest\s*(?:ful)?\s*api/i.test(text)) found.add('rest api');

    // Return unique skills as an array
    return [...found];
}

/**
 * Normalise text for matching:
 * - lowercase
 * - collapse whitespace
 * - keep meaningful punctuation (+, #, . for tech names)
 */
function normaliseText(text) {
    return text
        .toLowerCase()
        .replace(/[\r\n]+/g, ' ')      // newlines → spaces
        .replace(/\s+/g, ' ')          // collapse whitespace
        .trim();
}

/**
 * Tokenise normalised text into individual words/symbols.
 * Splits on common delimiters while preserving tech-relevant chars.
 */
function tokenise(text) {
    // Replace common delimiters with spaces, but keep +, #, .
    const cleaned = text
        .replace(/[,;:|()\[\]{}"'`!?@$%^&*=<>~\\]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return cleaned.split(' ').filter(t => t.length > 0);
}

/** Escape special regex characters in a string */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { extractSkills };
