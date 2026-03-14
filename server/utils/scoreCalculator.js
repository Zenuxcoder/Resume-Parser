/**
 * scoreCalculator.js
 *
 * Calculates matching score between resume skills and JD skills.
 * Uses Set-based lookups for performance.
 *
 * Score formula: (Matched JD Skills / Total JD Skills) × 100
 */

/**
 * Calculate the matching score and per-skill analysis.
 *
 * @param {string[]} resumeSkills  — skills from the resume
 * @param {string[]} jdSkills      — required skills from the JD
 * @returns {{ skillsAnalysis: Array, matchingScore: number }}
 */
function calculateMatchScore(resumeSkills, jdSkills) {
    // Normalise to lowercase Sets for fast O(1) lookup
    const resumeSet = new Set(
        (resumeSkills || []).map(s => s.toLowerCase().trim())
    );

    // Deduplicate JD skills
    const uniqueJDSkills = [...new Set(
        (jdSkills || []).map(s => s.toLowerCase().trim())
    )];

    // Build per-skill analysis
    const skillsAnalysis = uniqueJDSkills.map(skill => ({
        skill,
        presentInResume: resumeSet.has(skill)
    }));

    // Count matches
    const matchedCount = skillsAnalysis.filter(s => s.presentInResume).length;
    const total = uniqueJDSkills.length;

    // Score = (matched / total) × 100, rounded
    const matchingScore = total > 0 ? Math.round((matchedCount / total) * 100) : 0;

    return { skillsAnalysis, matchingScore };
}

module.exports = { calculateMatchScore };
