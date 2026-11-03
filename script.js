// Game State
let score = 0;
let servedCount = 0;
let currentOrder = [];
let activeCustomer = null;
let patienceTimer = null;
let patienceLevel = 100;

const meals = [
    { name: 'Crispy Chicken Bao', icon: '🥙' },
    { name: 'BBQ Pork Bao', icon: '🥟' },
    { name: 'Veggies Bao', icon: '🥬' }
];

const sides = [
    { name: 'Boba Milk Tea', icon: '🧋' },
    { name: 'Dim Sum', icon: '🍱' },
    { name: 'Chili Sauce', icon: '🌶️' }
];

const customerAvatars = ['👨‍💼', '👩‍🦰', '🧑‍🎨', '🧔', '👩‍💻'];

function initGame() {
    spawnCustomer();
}

function spawnCustomer() {
    if (activeCustomer) return;

    // Generate Random Order (1 Main + optional 1 Side)
    const randomMeal = meals[Math.floor(Math.random() * meals.length)];
    const needsSide = Math.random() > 0.4;
    const randomSide = needsSide ? sides[Math.floor(Math.random() * sides.length)] : null;

    const targetItems = [randomMeal.name];
    if (randomSide) targetItems.push(randomSide.name);

    const avatar = customerAvatars[Math.floor(Math.random() * customerAvatars.length)];

    activeCustomer = {
        avatar: avatar,
        items: targetItems,
        displayText: targetItems.join(' + ')
    };

    renderCustomer();
    startPatienceTimer();
}

function renderCustomer() {
    const area = document.getElementById('customer-area');
    area.innerHTML = `
        <div class="customer">
            <div class="speech-bubble">
                I want:<br><strong>${activeCustomer.displayText}</strong>
            </div>
            <div class="avatar">${activeCustomer.avatar}</div>
            <div class="patience-bar">
                <div id="patience-fill" class="patience-fill"></div>
            </div>
        </div>
    `;
}

function startPatienceTimer() {
    patienceLevel = 100;
    clearInterval(patienceTimer);
    
    patienceTimer = setInterval(() => {
        patienceLevel -= 2;
        const fill = document.getElementById('patience-fill');
        if (fill) {
            fill.style.width = patienceLevel + '%';
            if (patienceLevel < 30) {
                fill.style.backgroundColor = '#e74c3c';
            } else if (patienceLevel < 60) {
                fill.style.backgroundColor = '#f1c40f';
            }
        }

        if (patienceLevel <= 0) {
            clearInterval(patienceTimer);
            showFeedback('Customer Left! -10', false);
            updateScore(-10);
            removeCustomer();
        }
    }, 300);
}

function addItem(itemName, icon) {
    if (currentOrder.length < 3) {
        currentOrder.push(itemName);
        updatePlateDisplay();
    }
}

function clearPlate() {
    currentOrder = [];
    updatePlateDisplay();
}

function updatePlateDisplay() {
    const display = document.getElementById('dish-display');
    if (currentOrder.length === 0) {
        display.innerText = 'Select Items To Cook';
    } else {
        display.innerText = currentOrder.join(' + ');
    }
}

function serveOrder() {
    if (!activeCustomer || currentOrder.length === 0) return;

    // Check if current order matches customer order
    const isCorrect = Array.isArray(currentOrder) &&
        Array.isArray(activeCustomer.items) &&
        currentOrder.length === activeCustomer.items.length &&
        currentOrder.slice().sort().every((val, index) => val === activeCustomer.items.slice().sort()[index]);

    clearInterval(patienceTimer);

    if (isCorrect) {
        const earnedPoints = 50 + Math.floor(patienceLevel / 2);
        updateScore(earnedPoints);
        servedCount++;
        document.getElementById('served-val').innerText = servedCount;
        showFeedback(`+${earnedPoints} Perfect!`, true);
    } else {
        updateScore(-20);
        showFeedback('-20 Wrong Order!', false);
    }

    clearPlate();
    removeCustomer();
}

function removeCustomer() {
    activeCustomer = null;
    document.getElementById('customer-area').innerHTML = '';
    setTimeout(spawnCustomer, 1500);
}

function updateScore(points) {
    score = Math.max(0, score + points);
    document.getElementById('score-val').innerText = score;
}

function showFeedback(text, isPositive) {
    const fb = document.getElementById('feedback');
    fb.innerText = text;
    fb.className = `feedback show ${isPositive ? 'positive' : 'negative'}`;
    setTimeout(() => {
        fb.className = 'feedback';
    }, 1000);
}

// Initialize game on load
window.onload = initGame;
