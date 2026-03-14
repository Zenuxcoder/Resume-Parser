/**
 * matcher.js
 * Compares resume skills against JD required skills to produce
 * a skill analysis and matching score. No AI/LLM is used.
 *
 * Uses the new scoreCalculator for accurate scoring.
 */

const { calculateMatchScore } = require('./scoreCalculator');

/**
 * Match a resume against multiple JDs.
 *
 * @param {object} resumeData  — { name, yearsOfExperience, resumeSkills }
 * @param {object[]} jdDataArray — Array of parsed JD objects
 * @returns {object} Full output with matchingJobs array
 */
function matchResumeToJobs(resumeData, jdDataArray) {
    const matchingJobs = jdDataArray.map(jd => {
        const { skillsAnalysis, matchingScore } = calculateMatchScore(
            resumeData.resumeSkills,
            jd.requiredSkills
        );

        return {
            jobId: jd.jobId,
            role: jd.role,
            salary: jd.salary,
            aboutRole: jd.aboutRole,
            skillsAnalysis,
            matchingScore
        };
    });

    // Sort by score descending (best match first)
    matchingJobs.sort((a, b) => b.matchingScore - a.matchingScore);

    return {
        name: resumeData.name,
        yearsOfExperience: resumeData.yearsOfExperience,
        resumeSkills: resumeData.resumeSkills,
        matchingJobs
    };
}

module.exports = { matchResumeToJobs };
