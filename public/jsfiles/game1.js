const player = document.querySelector('.player');
const doll = document.querySelector('.doll');
const timerElement = document.getElementById('timer');
const flashCard = document.getElementById('flashCard');
const introElement = document.getElementById('intro');

// Set initial position of the player to bottom center
player.style.position = 'absolute';
player.style.top = '90vh'; // Adjusted for 100vh height
player.style.left = '50vw'; // Center horizontally
player.style.transform = 'translateX(-50%)'; // Center horizontally

let timeLeft = 90; // 1 minute 30 seconds in seconds
let timerInterval;
let lightInterval;
let gameStarted = false;
let lastTop = parseFloat(player.style.top);
let lastLeft = parseFloat(player.style.left);

function movePlayer(event) {
    if (!gameStarted) return; // Prevent movement if the game hasn't started

    const top = parseFloat(player.style.top);
    const left = parseFloat(player.style.left);

    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            if (top > 0) player.style.top = (top - 0.1) + 'vh'; // Move up 90% slower
            break;
        case 'ArrowDown':
        case 's':
            if (top < 90) player.style.top = (top + 0.05) + 'vh'; // Move down 90% slower
            break;
        case 'ArrowLeft':
        case 'a':
            if (left > 0) player.style.left = (left - 0.05) + 'vw'; // Move left 90% slower
            break;
        case 'ArrowRight':
        case 'd':
            if (left < 75) player.style.left = (left + 0.05) + 'vw'; // Move right 90% slower
            break;
    }

    // Check if player crosses the white line
    if (top < 11) {
        showFlashCard("Player 456 Pass", '/proceed1');
    }

    // Check if player moves when the light is red
    if (doll.style.backgroundColor === 'red' && (top !== lastTop || left !== lastLeft)) {
        showFlashCard("You Lost", '/lost');
    }

    lastTop = top;
    lastLeft = left;
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        clearInterval(timerInterval);
        clearInterval(lightInterval);
        showFlashCard("You Lost", '/lost');
    }
}

function toggleLight() {
    const isGreen = doll.style.backgroundColor === 'green';
    doll.style.backgroundColor = isGreen ? 'red' : 'green';
    const nextInterval = isGreen ? Math.random() * 3000 + 3000 : Math.random() * 3000 + 2000; // Green light duration slightly longer
    clearInterval(lightInterval);
    lightInterval = setInterval(toggleLight, nextInterval);
}

function showFlashCard(message, route) {
    clearInterval(timerInterval); // Stop the timer
    flashCard.querySelector('p').textContent = message;
    flashCard.style.display = 'flex';
    flashCard.querySelector('button').onclick = function() {
        proceed(route);
    };
}

function proceed(route) {
    // Make a post request to the express server
    fetch(route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ player: 456 })
    }).then(response => {
        if (response.ok) {
            window.location.href = response.url; // Redirect to the new URL
        } else {
            alert('Failed to proceed.');
        }
    });
}

function showIntro() {
    const message = "Game 1\nRed Light Green Light";
    let index = 0;

    function typeMessage() {
        if (index < message.length) {
            introElement.textContent += message[index];
            index++;
            setTimeout(typeMessage, 100);
        } else {
            setTimeout(deleteMessage, 1000);
        }
    }

    function deleteMessage() {
        if (index > 0) {
            introElement.textContent = introElement.textContent.slice(0, -1);
            index--;
            setTimeout(deleteMessage, 100);
        } else {
            introElement.style.display = 'none';
            startGame();
        }
    }

    introElement.style.display = 'block';
    typeMessage();
}

function startGame() {
    gameStarted = true;
    timerInterval = setInterval(updateTimer, 1000); // Update timer every second
    lightInterval = setInterval(toggleLight, Math.random() * 3000 + 3000); // Initial green light duration slightly longer
}

document.addEventListener('keydown', movePlayer);
showIntro();
