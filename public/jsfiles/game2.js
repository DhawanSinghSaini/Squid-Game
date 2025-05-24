let timer = document.getElementById('timer');
let time = 90; // 1 minute 30 seconds in seconds
let intervalId;
let win = true; // Initialize win variable

function startTimer() {
    intervalId = setInterval(() => {
        if (time <= 0) {
            clearInterval(intervalId);
            showFlashCard("The ground dissolved beneath your feet. A chilling silence followed.", '/lost');
            return;
        }
        time--;
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
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

window.onload = function() {
    const message = document.getElementById('message');
    const messageText = "Game 2: Glass Bridge";
    let messageIndex = 0;
    let instructionsComplete = false;

    function typeMessage() {
        if (messageIndex < messageText.length) {
            message.textContent += messageText.charAt(messageIndex);
            messageIndex++;
            setTimeout(typeMessage, 100);
        } else {
            setTimeout(deleteMessage, 1000);
        }
    }

    function deleteMessage() {
        if (messageIndex > 0) {
            message.textContent = messageText.substring(0, messageIndex - 1);
            messageIndex--;
            setTimeout(deleteMessage, 100);
        } else {
            message.style.opacity = 0;
            instructionsComplete = true;
            startTimer(); // Start the timer after message disappears
        }
    }

    message.style.opacity = 1;
    typeMessage();

    const player = document.querySelector('.player');
    const leftButton = document.querySelector('.left');
    const rightButton = document.querySelector('.right');
    const tile7 = document.querySelector('.tile7');
    const tile14 = document.querySelector('.tile14');
    const tile6 = document.querySelector('.tile6');
    const tile13 = document.querySelector('.tile13');
    const tile5 = document.querySelector('.tile5');
    const tile12 = document.querySelector('.tile12');
    const tile4 = document.querySelector('.tile4');
    const tile11 = document.querySelector('.tile11');
    const tile3 = document.querySelector('.tile3');
    const tile10 = document.querySelector('.tile10');
    const tile2 = document.querySelector('.tile2');
    const tile9 = document.querySelector('.tile9');
    const tile1 = document.querySelector('.tile1');
    const tile8 = document.querySelector('.tile8');
    const topPlatform = document.querySelector('.platform.top');
    const hearts = document.querySelectorAll('.heart');
    const flashCard = document.getElementById('flashCard');
    let currentTile = null;
    let heartsCount = hearts.length;

    function movePlayerToTile(tile) {
        const tileRect = tile.getBoundingClientRect();
        const playgroundRect = document.querySelector('.playground').getBoundingClientRect();
        player.style.top = `${tileRect.top - playgroundRect.top}px`;
        player.style.left = `${tileRect.left - playgroundRect.left}px`;

        if (tile.classList.contains('normal')) {
            heartsCount--;
            hearts[heartsCount].style.display = 'none';
            setTimeout(() => {
                tile.classList.add('disappear');
            }, 500); // Delay to ensure the player has moved from the tile
        }

        if (heartsCount === 0) {
            win = false; // Set win to false if all hearts are lost
            showFlashCard("The ground dissolved beneath your feet. A chilling silence followed.", '/lost');
            disableButtons(); // Disable buttons when player loses
        }

        currentTile = tile;
    }

    function movePlayerToTopPlatform() {
        const topPlatformRect = topPlatform.getBoundingClientRect();
        const playgroundRect = document.querySelector('.playground').getBoundingClientRect();
        player.style.top = `${topPlatformRect.top - playgroundRect.top + topPlatformRect.height / 2 - player.offsetHeight / 2}px`;
        player.style.left = `${topPlatformRect.left - playgroundRect.left + topPlatformRect.width / 2 - player.offsetWidth / 2}px`;
        showFlashCard("You won this time.", '/proceed2');
    }

    function allocateTiles() {
        const pairs = [
            [tile1, tile8],
            [tile2, tile9],
            [tile3, tile10],
            [tile4, tile11],
            [tile5, tile12],
            [tile6, tile13],
            [tile7, tile14]
        ];

        pairs.forEach(pair => {
            const randomIndex = Math.floor(Math.random() * 2);
            pair[randomIndex].classList.add('tempered');
            pair[1 - randomIndex].classList.add('normal');
        });
    }

    function showFlashCard(message, route) {
        flashCard.querySelector('p').textContent = message;
        flashCard.style.display = 'block';
        flashCard.querySelector('button').onclick = function() {
            proceed(route);
        };
    }

    function disableButtons() {
        leftButton.disabled = true;
        rightButton.disabled = true;
    }

    allocateTiles();

    leftButton.addEventListener('click', () => {
        if (instructionsComplete && win) {
            if (currentTile === null) {
                movePlayerToTile(tile7);
            } else if (currentTile === tile7 || currentTile === tile14) {
                movePlayerToTile(tile6);
            } else if (currentTile === tile6 || currentTile === tile13) {
                movePlayerToTile(tile5);
            } else if (currentTile === tile5 || currentTile === tile12) {
                movePlayerToTile(tile4);
            } else if (currentTile === tile4 || currentTile === tile11) {
                movePlayerToTile(tile3);
            } else if (currentTile === tile3 || currentTile === tile10) {
                movePlayerToTile(tile2);
            } else if (currentTile === tile2 || currentTile === tile9) {
                movePlayerToTile(tile1);
            } else if (currentTile === tile1 || currentTile === tile8) {
                movePlayerToTopPlatform();
            }
        }
    });

    rightButton.addEventListener('click', () => {
        if (instructionsComplete && win) {
            if (currentTile === null) {
                movePlayerToTile(tile14);
            } else if (currentTile === tile7 || currentTile === tile14) {
                movePlayerToTile(tile13);
            } else if (currentTile === tile6 || currentTile === tile13) {
                movePlayerToTile(tile12);
            } else if (currentTile === tile5 || currentTile === tile12) {
                movePlayerToTile(tile11);
            } else if (currentTile === tile4 || currentTile === tile11) {
                movePlayerToTile(tile10);
            } else if (currentTile === tile3 || currentTile === tile10) {
                movePlayerToTile(tile9);
            } else if (currentTile === tile2 || currentTile === tile9) {
                movePlayerToTile(tile8);
            } else if (currentTile === tile1 || currentTile === tile8) {
                movePlayerToTopPlatform();
            }
        }
    });

    document.querySelectorAll('.tile').forEach(tile => {
        tile.addEventListener('transitionend', () => {
            if (tile.classList.contains('disappear')) {
                tile.style.display = 'none';
            }
        });
    });
};


