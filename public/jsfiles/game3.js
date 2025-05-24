let computerMarbles = 5;
let playerMarbles = 5;
let stop = false;

function updateMarbles(playerSelection = 0, computerSelection = 0) {
    const topMarbles = document.querySelectorAll('.top-marbles .marble');
    const bottomMarbles = document.querySelectorAll('.bottom-marbles .marble');

    topMarbles.forEach((marble, index) => {
        marble.style.visibility = index < computerSelection ? 'visible' : 'hidden';
        marble.style.opacity = index < computerSelection ? '1' : '0';
    });

    bottomMarbles.forEach((marble, index) => {
        marble.style.visibility = index < playerSelection ? 'visible' : 'hidden';
        marble.style.opacity = index < playerSelection ? '1' : '0';
    });

    // Update the max value of the number selector based on the player's marbles
    const numberSelector = document.getElementById('number-selector');
    numberSelector.max = playerMarbles;
}

function computerSelectMarbles() {
    return Math.floor(Math.random() * computerMarbles) + 1;
}

function checkGuess(playerGuess, playerSelection, computerSelection) {
    if (stop) return;

    const isEven = computerSelection % 2 === 0;
    const playerGuessedCorrectly = (playerGuess === 'even' && isEven) || (playerGuess === 'odd' && !isEven);

    const messageElement = document.querySelector('.message');

    if (playerGuessedCorrectly) {
        messageElement.textContent = `Player guessed correctly! Player gains ${computerSelection} marbles.`;
        setTimeout(() => {
            playerMarbles += computerSelection;
            computerMarbles -= computerSelection;
            updateMarbles();
            hideMessageAndCloseHands();
            checkGameConclusion();
        }, 4000); // Delay of 4 seconds
    } else {
        messageElement.textContent = `Player guessed incorrectly. Opponent gains ${playerSelection} marbles.`;
        computerMarbles += playerSelection;
        playerMarbles -= playerSelection;
        updateMarbles();
        hideMessageAndCloseHands();
        checkGameConclusion();
    }

    animateHands(computerSelection, playerSelection);
}

function animateHands(computerSelection, playerSelection) {
    const topImage = document.querySelector('.top-image');
    const topImageClosed = document.querySelector('.top-image-closed');
    const bottomImage = document.querySelector('.bottom-image');
    const bottomImageClosed = document.querySelector('.bottom-image-closed');

    topImageClosed.style.opacity = 0;
    topImage.style.opacity = 1;
    bottomImageClosed.style.opacity = 0;
    bottomImage.style.opacity = 1;

    updateMarbles(playerSelection, computerSelection); // Ensure marbles are visible when hands open

    // Disable the buttons
    document.querySelector('.odd-button').disabled = true;
    document.querySelector('.even-button').disabled = true;
}

function hideMessageAndCloseHands() {
    const messageElement = document.querySelector('.message');
    const topImage = document.querySelector('.top-image');
    const topImageClosed = document.querySelector('.top-image-closed');
    const bottomImage = document.querySelector('.bottom-image');
    const bottomImageClosed = document.querySelector('.bottom-image-closed');

    setTimeout(() => {
        messageElement.textContent = '';
        topImage.style.opacity = 0;
        topImageClosed.style.opacity = 1;
        bottomImage.style.opacity = 0;
        bottomImageClosed.style.opacity = 1;
        updateMarbles(0, 0); // Hide all marbles

        // Enable the buttons
        document.querySelector('.odd-button').disabled = false;
        document.querySelector('.even-button').disabled = false;
    }, 4000); // Delay of 4 seconds
}

function checkGameConclusion() {
    const flashCard = document.querySelector('.flash-card');
    const flashCardMessage = document.querySelector('.flash-card-message');
    const oddButton = document.querySelector('.odd-button');
    const evenButton = document.querySelector('.even-button');

    if (playerMarbles >= 10) {
        flashCardMessage.textContent = 'Congratulations! You won!';
        flashCard.style.display = 'block';
        oddButton.disabled = true;
        evenButton.disabled = true;
        updateMarbles(playerMarbles, 0); // Show all marbles on the player's side
        stop = true;
    } else if (computerMarbles >= 10) {
        flashCardMessage.textContent = 'Better Luck Next Time!';
        flashCard.style.display = 'block';
        oddButton.disabled = true;
        evenButton.disabled = true;
        updateMarbles(0, computerMarbles); // Show all marbles on the opponent's side
        stop = true;
    }

    // Keep both hands open
    const topImage = document.querySelector('.top-image');
    const bottomImage = document.querySelector('.bottom-image');
    topImage.style.opacity = 1;
    bottomImage.style.opacity = 1;
}

function showIntroMessage() {
    const introMessage = document.querySelector('.intro-message');
    const introMessageContainer = document.querySelector('.intro-message-container');
    const oddButton = document.querySelector('.odd-button');
    const evenButton = document.querySelector('.even-button');
    const numberSelector = document.querySelector('.number-selector');

    let index = 0;
    const message = 'Final Game: Odd Even';

    function showNextCharacter() {
        if (index < message.length) {
            introMessage.textContent += message[index];
            introMessage.style.opacity = 1;
            index++;
            setTimeout(showNextCharacter, 200); // Delay between characters
        } else {
            setTimeout(hideIntroMessage, 1000); // Delay before hiding the message
        }
    }

    function hideIntroMessage() {
        if (index >= 0) {
            introMessage.textContent = message.slice(0, index);
            introMessage.style.opacity = 0;
            index--;
            setTimeout(hideIntroMessage, 200); // Delay between characters
        } else {
            introMessageContainer.style.display = 'none';
            oddButton.disabled = false;
            evenButton.disabled = false;
            numberSelector.disabled = false;
        }
    }

    showNextCharacter();
}

document.addEventListener('DOMContentLoaded', () => {
    updateMarbles();
    showIntroMessage();
});

// Event listener for the player's selection
document.querySelector('.number-selector').addEventListener('input', (event) => {
    const playerSelection = parseInt(event.target.value);
    console.log(`Player selected ${playerSelection} marbles`);
    updateMarbles(playerSelection, 0); // Update the display to show the selected marbles
});

// Event listeners for the Odd and Even buttons
document.querySelector('.odd-button').addEventListener('click', () => {
    const playerSelection = parseInt(document.getElementById('number-selector').value);
    const computerSelection = computerSelectMarbles();
    console.log(`Computer selected ${computerSelection} marbles`);
    console.log('Player guessed Odd');
    updateMarbles(playerSelection, computerSelection); // Update the display to show the selected marbles
    checkGuess('odd', playerSelection, computerSelection);
});

document.querySelector('.even-button').addEventListener('click', () => {
    const playerSelection = parseInt(document.getElementById('number-selector').value);
    const computerSelection = computerSelectMarbles();
    console.log(`Computer selected ${computerSelection} marbles`);
    console.log('Player guessed Even');
    updateMarbles(playerSelection, computerSelection); // Update the display to show the selected marbles
    checkGuess('even', playerSelection, computerSelection);
});

// Event listener for the Proceed button
document.querySelector('.proceed-button').addEventListener('click', () => {
    const flashCard = document.querySelector('.flash-card');
    flashCard.style.display = 'none';
    // Reset the game or proceed to the next step
    fetch(route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ player: 456 }) }).then(response => { if (response.ok) { window.location.href = response.url;  } else { alert('Failed to proceed.'); } });
});
