// script.js
document.addEventListener('DOMContentLoaded', function() {
  const introVideo = document.getElementById('intro-video');
  const backgroundMusic = document.getElementById('background-music');
  const recruiter = document.querySelector('.recruiter');
  const dialog = document.getElementById('dialog');
  const dialogText = document.getElementById('dialog-text');
  const inputCard = document.getElementById('input-card');
  const cardBack = document.getElementById('card-back');

  // Play background music when the website loads
  backgroundMusic.play();

  // Show recruiter and dialog after the video ends
  introVideo.addEventListener('ended', function() {
    recruiter.style.display = 'block';
    setTimeout(() => {
      dialog.style.display = 'block';
      typeWriter(dialogText, () => {
        setTimeout(() => {
          dialog.style.display = 'none';
          inputCard.style.display = 'block';
        }, 1000); // Adjust the delay as needed
      });
    }, 3000); // Adjust the delay as needed
  });

  // Flip the card when the back is clicked
  cardBack.addEventListener('click', function() {
    inputCard.classList.add('flipped');
  });

  // Typewriter effect
  function typeWriter(element, callback) {
    const text = element.innerHTML;
    element.innerHTML = '';
    let i = 0;
    const speed = 50; // Adjust the speed as needed
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    }
    type();
  }
});



  