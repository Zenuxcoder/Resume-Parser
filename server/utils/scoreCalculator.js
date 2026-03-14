
function calculateMatchScore(resumeSkills, jdSkills) {
    const resumeSet = new Set(
        (resumeSkills || []).map(s => s.toLowerCase().trim())
    );

    const uniqueJDSkills = [...new Set(
        (jdSkills || []).map(s => s.toLowerCase().trim())
    )];

    const skillsAnalysis = uniqueJDSkills.map(skill => ({
        skill,
        presentInResume: resumeSet.has(skill)
    }));

    const matchedCount = skillsAnalysis.filter(s => s.presentInResume).length;
    const total = uniqueJDSkills.length;

    const matchingScore = total > 0 ? Math.round((matchedCount / total) * 100) : 0;

    return { skillsAnalysis, matchingScore };
}

module.exports = { calculateMatchScore };
