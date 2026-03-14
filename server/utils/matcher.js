
const { calculateMatchScore } = require('./scoreCalculator');

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

    matchingJobs.sort((a, b) => b.matchingScore - a.matchingScore);

    return {
        name: resumeData.name,
        yearsOfExperience: resumeData.yearsOfExperience,
        resumeSkills: resumeData.resumeSkills,
        matchingJobs
    };
}

module.exports = { matchResumeToJobs };
