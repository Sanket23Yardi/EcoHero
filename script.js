// --- DATA: The Challenges ---
const CHALLENGES = [
    { id: 1, title: 'Plastic-Free Lunch', desc: 'Use reusable containers for your meal.', points: 50, type: 'Waste' },
    { id: 2, title: 'Energy Saver', desc: 'Turn off lights when leaving a room.', points: 30, type: 'Energy' },
    { id: 3, title: 'Public Transport', desc: 'Take a bus or train instead of a car.', points: 100, type: 'Transport' },
    { id: 4, title: 'Meat-Free Monday', desc: 'Eat only vegetarian meals today.', points: 80, type: 'Food' },
    { id: 5, title: 'Short Shower', desc: 'Take a shower under 5 minutes.', points: 40, type: 'Water' },
    { id: 6, title: 'Recycle Right', desc: 'Separate your dry and wet waste.', points: 60, type: 'Waste' }
];

// --- DATA: The Badges ---
const BADGES = [
    { name: 'Seedling', score: 100, icon: '🌱' },
    { name: 'Sapling', score: 300, icon: '🌿' },
    { name: 'Eco Hero', score: 600, icon: '🌳' }
];

// --- STATE MANAGEMENT ---
// Load completed tasks from Browser Storage (LocalStorage)
let completedTasks = JSON.parse(localStorage.getItem('ecoHeroCompleted')) || [];
let currentScore = 0;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    calculateScore();
    renderBadges();
    renderChallenges();
});

// --- CORE FUNCTIONS ---

function calculateScore() {
    currentScore = 0;
    CHALLENGES.forEach(task => {
        if (completedTasks.includes(task.id)) {
            currentScore += task.points;
        }
    });
    
    updateUI();
}

function updateUI() {
    // Update Text
    document.getElementById('scoreDisplay').innerText = currentScore;
    document.getElementById('tasksDisplay').innerText = completedTasks.length;

    // Update Progress Bar
    const maxScore = 600;
    const progressPct = Math.min((currentScore / maxScore) * 100, 100);
    document.getElementById('progressBar').style.width = `${progressPct}%`;
    document.getElementById('progressText').innerText = `${Math.round(progressPct)}%`;

    // Refresh Badges (to show unlocked ones)
    renderBadges();
}

function renderBadges() {
    const container = document.getElementById('badgeContainer');
    container.innerHTML = ''; // Clear previous

    BADGES.forEach(badge => {
        const div = document.createElement('div');
        div.className = `badge ${currentScore >= badge.score ? 'unlocked' : ''}`;
        div.innerText = `${badge.icon} ${badge.name} (${badge.score} pts)`;
        container.appendChild(div);
    });
}

function renderChallenges() {
    const grid = document.getElementById('challengeGrid');
    grid.innerHTML = ''; // Clear previous

    CHALLENGES.forEach(task => {
        const isDone = completedTasks.includes(task.id);

        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <div>
                <span class="tag">${task.type}</span>
                <h3>${task.title}</h3>
                <p>${task.desc}</p>
            </div>
            <button 
                class="action-btn ${isDone ? 'completed' : ''}" 
                onclick="toggleTask(${task.id})"
            >
                ${isDone ? `Completed (+${task.points}) ✅` : `Complete Challenge (+${task.points})`}
            </button>
        `;
        
        grid.appendChild(card);
    });
}

// --- USER INTERACTION ---
window.toggleTask = function(id) {
    if (completedTasks.includes(id)) {
        // Remove task
        completedTasks = completedTasks.filter(taskId => taskId !== id);
    } else {
        // Add task
        completedTasks.push(id);
    }

    // Save to LocalStorage
    localStorage.setItem('ecoHeroCompleted', JSON.stringify(completedTasks));

    // Re-calculate and Re-render
    calculateScore();
    renderChallenges(); // Re-render buttons to update text/color
};