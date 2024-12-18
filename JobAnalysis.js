class Job {
  constructor(title, postedTime, type, level, skill, detail, link, estimatedTime) {
    this.title = title;
    this.postedTime = postedTime;
    this.type = type;
    this.level = level;
    this.skill = skill;
    this.detail = detail;
    this.link = link; // New field for Job Page Link
    this.estimatedTime = estimatedTime; // New field for Estimated Time
  }

  getDetails() {
    return `Title: ${this.title}
Type: ${this.type}
Level: ${this.level}
Skill: ${this.skill}
Posted: ${this.postedTime}
Estimated Time: ${this.estimatedTime || "N/A"}
Link: ${this.link}
Description: ${this.detail}`;
  }
}


const jobs = [];
const jobList = document.getElementById('jobList');
const levelFilter = document.getElementById('levelFilter');
const typeFilter = document.getElementById('typeFilter');
const skillFilter = document.getElementById('skillFilter');
const sortBy = document.getElementById('sortBy');

document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('filterButton').addEventListener('click', filterJobs);
document.getElementById('sortButton').addEventListener('click', sortJobs);

function handleFileUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
      try {
          const data = JSON.parse(e.target.result); // Parse the JSON file
          loadJobs(data);
      } catch (error) {
          alert('Invalid JSON file format.');
      }
  };
  reader.readAsText(file); // Read the file as text
}

function loadJobs(data) {
  jobs.length = 0; // Clear existing jobs
  data.forEach((job) => {
    jobs.push(
      new Job(
        job["Title"],
        job["Posted"],
        job["Type"],
        job["Level"],
        job["Skill"],
        job["Detail"],
        job["Job Page Link"], // Add new field
        job["Estimated Time"] // Add new field
      )
    );
  });
  populateFilters();
  displayJobs(jobs);
}


function populateFilters() {
  const skills = new Set(jobs.map((job) => job.skill));
  skillFilter.innerHTML = '<option value="All">All</option>';
  skills.forEach((skill) => {
    const option = document.createElement('option');
    option.value = skill;
    option.textContent = skill;
    skillFilter.appendChild(option);
  });
}

function filterJobs() {
  const level = levelFilter.value;
  const type = typeFilter.value;
  const skill = skillFilter.value;

  const filteredJobs = jobs.filter((job) => {
    return (
      (level === 'All' || job.level === level) &&
      (type === 'All' || job.type === type) &&
      (skill === 'All' || job.skill === skill)
    );
  });

  displayJobs(filteredJobs);
}

function sortJobs() {
  const sortOption = sortBy.value;
  const sortedJobs = [...jobs];

  if (sortOption === 'Title (A-Z)') {
    sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === 'Posted Time (Newest First)') {
    sortedJobs.sort(
      (a, b) => new Date(b.postedTime) - new Date(a.postedTime)
    );
  }

  displayJobs(sortedJobs);
}

function displayJobs(jobArray) {
  jobList.innerHTML = '';
  if (jobArray.length === 0) {
    jobList.innerHTML = '<p class="no-jobs">No jobs available.</p>';
    return;
  }
  jobArray.forEach((job) => {
    const jobItem = document.createElement('div');
    jobItem.className = 'job-item';
    jobItem.textContent = `${job.title} - ${job.type} (${job.level})`;
    jobItem.addEventListener('click', () => {
      alert(job.getDetails());
    });
    jobList.appendChild(jobItem);
  });
}
