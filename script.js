// ===== State =====
// Stores parsed data from each step for use in matching
let parsedResume = null;
let parsedJDs = [];

// API base URL (same origin when served by Express)
const API = '/api';

// ===== Resume Upload =====
const resumeDropzone = document.getElementById('resumeDropzone');
const resumeFileInput = document.getElementById('resumeFileInput');
const resumeFileName = document.getElementById('resumeFileName');
const uploadResumeBtn = document.getElementById('uploadResumeBtn');
const resumeStatus = document.getElementById('resumeStatus');
const extractedInfo = document.getElementById('extractedInfo');

let selectedResumeFile = null;

// Click to browse
resumeDropzone.addEventListener('click', () => resumeFileInput.click());

// File selected via input
resumeFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        selectedResumeFile = e.target.files[0];
        resumeFileName.textContent = selectedResumeFile.name;
        resumeFileName.style.display = 'block';
        uploadResumeBtn.disabled = false;
    }
});

// Drag & drop
resumeDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    resumeDropzone.classList.add('dragover');
});

resumeDropzone.addEventListener('dragleave', () => {
    resumeDropzone.classList.remove('dragover');
});

resumeDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    resumeDropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        selectedResumeFile = e.dataTransfer.files[0];
        resumeFileName.textContent = selectedResumeFile.name;
        resumeFileName.style.display = 'block';
        uploadResumeBtn.disabled = false;
    }
});

// Upload Resume → POST /api/upload-resume
uploadResumeBtn.addEventListener('click', async () => {
    if (!selectedResumeFile) return;

    uploadResumeBtn.disabled = true;
    uploadResumeBtn.textContent = 'Uploading…';
    resumeStatus.style.display = 'none';

    try {
        const formData = new FormData();
        formData.append('resume', selectedResumeFile);

        const res = await fetch('/api/upload-resume', {
            method: 'POST',
            body: formData
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.error || 'Upload failed');
        }

        // Store parsed resume data
        parsedResume = json.data;

        // Show success
        resumeStatus.className = 'status-msg success';
        resumeStatus.textContent = '✓ Resume uploaded and parsed successfully.';

        // Populate extracted info
        document.getElementById('extractedName').textContent = parsedResume.name;
        document.getElementById('extractedExp').textContent =
            parsedResume.yearsOfExperience > 0
                ? parsedResume.yearsOfExperience + ' Years'
                : 'Not detected';

        const skillsContainer = document.getElementById('extractedSkills');
        skillsContainer.innerHTML = '';
        parsedResume.resumeSkills.forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag present';
            tag.textContent = skill;
            skillsContainer.appendChild(tag);
        });

        extractedInfo.classList.add('visible');

        // Show Next Step button
        document.getElementById('nextStepBtn').style.display = 'inline-block';

        // Enable match button if JDs are also available
        updateMatchButton();

    } catch (err) {
        resumeStatus.className = 'status-msg error';
        resumeStatus.textContent = '✗ ' + err.message;
    } finally {
        uploadResumeBtn.disabled = false;
        uploadResumeBtn.textContent = 'Upload Resume';
    }
});


// ===== Job Description Processing =====
const jobTextarea = document.getElementById('jobTextarea');
const processJobBtn = document.getElementById('processJobBtn');
const jobStatus = document.getElementById('jobStatus');
const jdList = document.getElementById('jdList');

// POST /api/process-jd
processJobBtn.addEventListener('click', async () => {
    const text = jobTextarea.value.trim();
    if (!text) {
        jobStatus.className = 'status-msg error';
        jobStatus.textContent = '✗ Please enter a job description.';
        return;
    }

    processJobBtn.disabled = true;
    processJobBtn.textContent = 'Processing…';
    jobStatus.className = 'status-msg';
    jobStatus.style.display = 'none';

    try {
        const res = await fetch(`${API}/process-jd`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jdText: text })
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.error || 'Processing failed');
        }

        // Store parsed JD data
        parsedJDs.push(json.data);

        jobStatus.className = 'status-msg success';
        jobStatus.textContent = `✓ Job description processed — ${json.data.jobId} (${json.data.role})`;

        // Add to the JD list
        addJDToList(json.data);

        // Clear textarea for next JD
        jobTextarea.value = '';

        // Enable match button if resume is also available
        updateMatchButton();

    } catch (err) {
        jobStatus.className = 'status-msg error';
        jobStatus.textContent = '✗ ' + err.message;
    } finally {
        processJobBtn.disabled = false;
        processJobBtn.textContent = 'Process Job Description';
    }
});

/** Show a compact card for each processed JD */
function addJDToList(jd) {
    jdList.style.display = 'block';
    const item = document.createElement('div');
    item.className = 'jd-item';
    item.innerHTML = `
    <strong>${jd.jobId}</strong> — ${jd.role}
    ${jd.salary ? ' · ' + jd.salary : ''}
    <span class="jd-skills">${jd.requiredSkills.join(', ')}</span>
  `;
    jdList.appendChild(item);
}


// ===== Match Jobs =====
const matchJobsBtn = document.getElementById('matchJobsBtn');

function updateMatchButton() {
    matchJobsBtn.disabled = !(parsedResume && parsedJDs.length > 0);
}

// POST /api/match-jobs
matchJobsBtn.addEventListener('click', async () => {
    if (!parsedResume || parsedJDs.length === 0) return;

    matchJobsBtn.disabled = true;
    matchJobsBtn.textContent = 'Matching…';

    try {
        const res = await fetch(`${API}/match-jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                resumeData: parsedResume,
                jdData: parsedJDs
            })
        });

        const json = await res.json();

        if (!res.ok) {
            throw new Error(json.error || 'Matching failed');
        }

        renderResults(json.data);

    } catch (err) {
        console.error('Match error:', err);
    } finally {
        matchJobsBtn.disabled = false;
        matchJobsBtn.textContent = 'Match Jobs';
    }
});


// ===== Render Matching Results =====
function renderResults(data) {
    const resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '';

    const allSkillAnalysis = [];

    data.matchingJobs.forEach(job => {
        const tr = document.createElement('tr');

        let scoreClass = 'score-low';
        if (job.matchingScore >= 70) scoreClass = 'score-high';
        else if (job.matchingScore >= 40) scoreClass = 'score-med';

        const matchedSkills = job.skillsAnalysis
            .filter(s => s.presentInResume)
            .map(s => capitalize(s.skill));

        tr.innerHTML = `
      <td>${job.jobId}</td>
      <td>${job.role}</td>
      <td><span class="score-badge ${scoreClass}">${job.matchingScore}%</span></td>
      <td>${matchedSkills.length > 0 ? matchedSkills.join(', ') : '—'}</td>
    `;
        resultsBody.appendChild(tr);

        // Collect skill analysis for the panel
        job.skillsAnalysis.forEach(s => allSkillAnalysis.push(s));
    });

    // Show results card
    document.getElementById('results').style.display = 'block';

    // Build combined skills analysis (deduplicated)
    buildSkillsAnalysis(allSkillAnalysis);
}

function buildSkillsAnalysis(allAnalysis) {
    const container = document.getElementById('skillsAnalysisList');
    container.innerHTML = '';

    // Deduplicate: a skill is "present" if it was found in ANY analysis
    const skillMap = new Map();
    allAnalysis.forEach(({ skill, presentInResume }) => {
        const key = skill.toLowerCase();
        if (!skillMap.has(key) || presentInResume) {
            skillMap.set(key, { skill, presentInResume });
        }
    });

    skillMap.forEach(({ skill, presentInResume }) => {
        const tag = document.createElement('span');
        tag.className = `skill-tag ${presentInResume ? 'present' : 'missing'}`;
        tag.textContent = `${capitalize(skill)} ${presentInResume ? '✓' : '✗'}`;
        container.appendChild(tag);
    });

    document.getElementById('skillsAnalysis').style.display = 'block';
}

function capitalize(str) {
    return str.replace(/\b\w/g, c => c.toUpperCase());
}


// ===== Two-Step UI Navigation =====
const step1Container = document.getElementById('step1-container');
const step2Container = document.getElementById('step2-container');
const nextStepBtn = document.getElementById('nextStepBtn');
const prevStepBtn = document.getElementById('prevStepBtn');

nextStepBtn.addEventListener('click', () => {
    step1Container.style.display = 'none';
    step2Container.style.display = 'block';

    // Auto-scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

prevStepBtn.addEventListener('click', () => {
    step2Container.style.display = 'none';
    step1Container.style.display = 'block';
});

