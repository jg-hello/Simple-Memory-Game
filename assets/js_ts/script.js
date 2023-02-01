let sequence = [];
let playerSequence = [];
let level = 0;

const startButton = document.getElementById("startBtn"); //start button
const info = document.querySelector(".js-info");
const heading = document.querySelector(".js-heading");
const panelContainer = document.querySelector(".js-container");
const infoAnimation = document.querySelector(".info-animation");

function resetGame(text) {
    alert(text); //alert message

    sequence = [];
    playerSequence = [];
    level = 0;
    startButton.classList.remove('hidden');
    heading.textContent = "Memory Game";
    info.classList.add('hidden');
    panelContainer.classList.add('unclickable');
}

function playerTurn(level) {
    panelContainer.classList.remove('unclickable');
    infoAnimation.classList.remove('info-animation')
    info.textContent = `${level} Tap${level > 1 ? 's' : ''}`;
}

function activatePanel(panelNum) {
    const panel = document.querySelector(`[data-panel='${panelNum}']`);
    const sound = document.querySelector(`[data-sound='${panelNum}']`);
    
    panel.classList.add('activated'); //adds activated class to   
    sound.play()
    



  
    setTimeout(() => {
        
        panel.classList.remove('activated');
    }, 300); //each panel is "active" for 300ms for when the sequence starts

}
function playRound(nextSequence) {
    nextSequence.forEach((panelNum, index) => {
        setTimeout(() => {
            activatePanel(panelNum); // each panel sequence  is activated at differnt times, so 600ms for first, 1200 for 2nd sequence, 1800ms for 3rd etc  
        }, (index + 1) * 600);
    });
}

function nextStep() {
    const panels = ["panelOne", "panelTwo", "panelThree", "panelFour", "panelFive", "panelSix", "panelSeven", "panelEight", "panelNine",]; //makes array from panels, panels has the name of each panel from HTML "data-panels"
    const random = panels[Math.floor(Math.random() * panels.length)]; //choose random number from array length
    return random;
}

console.log(nextStep());
const nextRound = () => {
    level += 1;
    panelContainer.classList.add('unclickable'); //adds "unclickable" class to panels again to prevent user input
    infoAnimation.classList.add('info-animation') //plays css effect during computer;s turn
    info.textContent = `Computer's Turn!`;
    heading.textContent = `Level ${level} of 20`; //states current level
    const nextSequence = [...sequence];
    nextSequence.push(nextStep()); //when nextStep() runs, it returns random value from panels array, then that value is added to the end of nextSequence array 
    playRound(nextSequence);
    sequence = [...nextSequence]; //sequence variable is assigned to the newest sequence 
    setTimeout(() => {
        playerTurn(level); //the duration of the sequence depends on the level
    }, level * 600 + 1000);
};

function handleClick(panel) {
    const i = playerSequence.push(panel) - 1; // adds new item to playerSequence array and stores it to i variable
    const sound = document.querySelector(`[data-sound='${panel}']`);
    const loseSound = document.getElementById("youLoseSound")
    const winMusic = document.getElementById('winMusic')
    sound.play();

    const remainingTaps = sequence.length - playerSequence.length; //remaining taps needed to be pressed
    
    if (playerSequence[i] !== sequence[i]) { //if the playerSequence array(tap order) !== the computer sequence array, the game resets
        sound.pause(); //pause panel sounds so it doesnt overlap with losesound audio
        loseSound.play();
        resetGame('Game Over. Try Again!');
        return;
    }

   /*    
    if (playerSequence.length === sequence.length) { //for extra panels to appear
        const extraPanels = document.getElementById('extraPanels')
        if (playerSequence.length ===  2 ){
            extraPanels.classList.remove('hiddenPanels')
            return;
        }
       
    }
     */
    if (playerSequence.length === sequence.length) {
        if (playerSequence.length ===  3 ){
            winMusic.play();
            resetGame(`Congratulations, You've won!`);
            return;
        }
    
   //if playerSequence and sequence are the same length, round is over and the next round starts
        playerSequence = [];
        info.textContent = 'Nice! Time for the next round!';
        setTimeout(() => {
            nextRound();
        }, 1500);
        return;
    }

    info.textContent = `Your turn: ${remainingTaps} Tap${
        remainingTaps > 1 ? 's' : ''
      }`;


}


function startGame() {
    startButton.classList.add('hidden');
    info.classList.remove('hidden');
    info.textContent = "Computer's Turn!";
    nextRound();
}


startButton.addEventListener('click', startGame);
panelContainer.addEventListener('click', e => {  //The value of data-panel on the element that was clicked is accessed and saved in the panel variable 
    const { panel } = e.target.dataset; //handleClick() is called with panel value as parameter 
    if (panel)
        handleClick(panel);
});

