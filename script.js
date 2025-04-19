// these values are set at the beginning
// and then used throughout the game
let gameState = {
    players: 2,
    whoseTurn: 1,
    gameOver: false
}


// function that considers which player's turn it is and then
// changes the UI accordingly
function changePlayer(randomDamage) {
    // if the current player is player 1 at the end of a move
    if (gameState.whoseTurn === 1) {
        let playerTwoHealth = document.getElementById("playerTwoHealth");
        // conversts the innerHTML from string to a number and stores it in a variable
        let playerTwoHealthNum = Number(playerTwoHealth.innerHTML);
        // reduces by random number between 0 and 10
        playerTwoHealthNum -= randomDamage;
        // resets the HTML to the new value
        playerTwoHealth.innerHTML = playerTwoHealthNum;

        // checks if the player has reached 0 health
        if (playerTwoHealthNum <= 0) {
            // ensures health does not dig into the negative
            playerTwoHealth.innerText = 0;
            // adds yellow halo around winning sprite
            let playerOneSprite = document.getElementById("playerOneSprite")
            playerOneSprite.classList.add("winner");
            // ends the game
            gameOver();
        }
        else {
            // switch to the next player and change the UI's display / behavior
            gameState.whoseTurn = 2;

            // grabs the 'playerName' element and changes the player's turn display
            let playerName = document.getElementById("playerName");
            playerName.innerHTML = `Player ${gameState.whoseTurn}`;
        }

    }else{
        let playerOneHealth = document.getElementById("playerOneHealth");
        // conversts the innerHTML from string to a number and stores it in a variable
        let playerOneHealthNum = Number(playerOneHealth.innerHTML);
        // reduces by random number between 0 and 10
        playerOneHealthNum -= randomDamage;
        // resets the HTML to the new value
        playerOneHealth.innerHTML = playerOneHealthNum;

        // checks if the player has reached 0 health
        if (playerOneHealthNum <= 0) {
            // ensures health does not dig into the negative
            playerOneHealth.innerText = 0;
            // adds yellow halo around winning sprite
            let playerTwoSprite = document.getElementById("playerTwoSprite");
            playerTwoSprite.classList.add("winner");
            // ends the game
            gameOver();
        }
        else {
            // switch to the next player and change the UI's display / behavior
            gameState.whoseTurn = 1;

            // grabs the 'playerName' element and changes the player's turn display
            let playerName = document.getElementById("playerName");
            playerName.innerHTML = `Player ${gameState.whoseTurn}`;
        }
    }
}

// if a player's health reaches 0 at the end of a turn, the game ends
// and the winner is announced
function gameOver() {
    let title = document.getElementById("title");
    // changed style declaration to specify display attribute
    title.style.display =  "none";
    let playerTurnDisplay = document.getElementById("playerTurn");
    //changed style declaration to specify display attribute
    playerTurnDisplay.style.display = "none";

    let winningPlayer = document.getElementById("winningPlayer");
    winningPlayer.innerHTML = `Player ${gameState.whoseTurn} wins!`

    let gameOverScreen = document.getElementById("gameOverScreen");
    // broke up style declaration to specify display and flexDirection attributes
    gameOverScreen.style.display = "flex";
    gameOverScreen.style.flexDirection = "column";

    // update gameState when game is over
    gameState.gameOver = true;
    // disable both attack buttons so user can't continue game
    disablePlayButtons();
    // play music when game ends at a 750 millisecond delay
    let successFanfare = document.getElementById("success-fanfare");
    setTimeout(() => successFanfare.play(), 750);
}

// disables both attack buttons and sets styling to that of the inactive class
function disablePlayButtons(){
    let playerOneAttackButton = document.getElementById("playerOneAttack");
    let playerTwoAttackButton = document.getElementById("playerTwoAttack");

    playerOneAttackButton.disabled = true;
    playerTwoAttackButton.disabled = true;

    playerOneAttackButton.classList.add("inactive");
    playerTwoAttackButton.classList.add("inactive");

    playerOneAttackButton.classList.remove("active");
    playerTwoAttackButton.classList.remove("active");

}

// function that allows the player two attack button to reduce the player two's
// health
function attackPlayerTwo() {
    // compartmentalized function that will switch the player 2 attack button to inactive
    // and player 1 attack button to active using DOM manipulation
    // this also DISABLES the button, meaning they are not interactable
    function changeButtonStatus() {
        // selects player 2 attack button
        let playerTwoAttackButton = document.getElementById("playerTwoAttack");
        // enables player 2 attack button
        playerTwoAttackButton.disabled = false;
        // adds 'active' class to button
        playerTwoAttackButton.classList.add("active");
        // removes 'inactive' class for button
        playerTwoAttackButton.classList.remove("inactive");
        // focuses on the button for improved accessibility
        playerTwoAttackButton.focus();

        // selects player 1 attack button
        let playerOneAttackButton = document.getElementById("playerOneAttack");
        // disables player 1 button
        playerOneAttackButton.disabled = true;
        // adds 'inactive' class to button
        playerOneAttackButton.classList.add("inactive");
        // removes 'inactive' class from button
        playerOneAttackButton.classList.remove("active");
    }

    // commpartmentalized function that changes the player 1's sprite using the array
    // containing multiple images
    function animatePlayer(randomDamage) {
        // an array containing the images using in player one's animation
        // the indices are later used to cycle / "animate" when the player attacks
        let playerOneFrames = [
            "./images/R_Idle.png",
            "./images/R_Attack.png"
        ];

        let playerSprite = document.getElementById("playerOneSprite");
        // in other words, we set to the attack sprite, wait 3 seconds,
        // then set it back to the idle sprite
        playerSprite.src = playerOneFrames[1];
        
        // removes the 'idle' class from the player sprite
        playerSprite.classList.remove("idle");
        // adds the 'attack-right' class to the player sprite
        // ** CHECK THE CSS TO NOTE THE CHANGES MADE **
        playerSprite.classList.add("attack-right");

        // grabs the enemy sprite
        let enemySprite = document.getElementById("playerTwoSprite");
        // grabs the damage sound
        let enemyDamage = document.getElementById("SFX_PlayerDamage");
        // removes the 'idle' class from the enemy sprite
        enemySprite.classList.remove("idle");
        // adds the 'damage-left' class to the enemy sprite
        enemySprite.classList.add("damage-left");
        // changes volume of damage sound depending on amount of points deducted from player's health
        enemyDamage.volume = randomDamage * .1;
        // sets the time for the sound to play at 0
        enemyDamage.currentTime = 0;
        // sound that plays when enemy takes damage
        enemyDamage.play();

        // the function we will call in the setTimeOut method below
        // after 350 milliseconds
        // this function will execute this block of code
        function changePlayerOneSprite() {
            enemySprite.classList.remove("damage-left");
            enemySprite.classList.add("idle");

            playerSprite.src = playerOneFrames[0];
            playerSprite.classList.remove("attack-right");
            playerSprite.classList.add("idle");
        }
        setTimeout(changePlayerOneSprite, 350);
    }

    // for easy reading,
    // we do not include ALL of the above code within this condition
    // instead, we create higher-order functions to keep the code neat and readable
    if (gameState.whoseTurn === 1) {
        // amount of damage player 1 will inflict on player 2
        const randomDamage = Math.floor(Math.random()*11);
        animatePlayer(randomDamage);
        changeButtonStatus();
        changePlayer(randomDamage);
    }
}

function attackPlayerOne() {
    // compartmentalized function that will switch the player 2 attack button to inactive
    // and player 1 attack button to active using DOM manipulation
    // this also DISABLES the button, meaning they are not interactable
    function changeButtonStatus() {
        // selects player 2 attack button
        let playerTwoAttackButton = document.getElementById("playerTwoAttack");
        // disables player 2 attack button
        playerTwoAttackButton.disabled = true;
        // adds 'inactive' class to button
        playerTwoAttackButton.classList.add("inactive");
        // removes 'active' class from button
        playerTwoAttackButton.classList.remove("active");

        // selects player 1 attack button
        let playerOneAttackButton = document.getElementById("playerOneAttack");
        // enables player 1 attack button
        playerOneAttackButton.disabled = false;
        // adds 'active' class to button
        playerOneAttackButton.classList.add("active");
        // removes 'inactive' class to button
        playerOneAttackButton.classList.remove("inactive");
        // focuses on the button for improved accessibility
        playerOneAttackButton.focus();
    }

    // commpartmentalized function that changes the player 2's sprite using the array
    // containing multiple images
    function animatePlayer() {
        // an array containing the images using in player two's animation
        // the indices are later used to cycle / "animate" when the player attacks
        let playerTwoFrames = [
            "./images/L_Idle.png",
            "./images/L_Attack.png"
        ];

        let playerSprite = document.getElementById("playerTwoSprite");
        // in other words, we set to the attack sprite, wait 3 seconds,
        // then set it back to the idle sprite
        playerSprite.src = playerTwoFrames[1];
        
        // removes the 'idle' class from the player sprite
        playerSprite.classList.remove("idle");
        // adds the 'attack-left' class to the player sprite
        // ** CHECK THE CSS TO NOTE THE CHANGES MADE **
        playerSprite.classList.add("attack-left");

        // grabs the enemy sprite
        let enemySprite = document.getElementById("playerOneSprite");
        // grabs the damage sound
        let enemyDamage = document.getElementById("SFX_PlayerDamage");
        // removes the 'idle' class from the enemy sprite
        enemySprite.classList.remove("idle");
        // adds the 'damage-right' class to the enemy sprite
        // ** CHECK THE CSS TO NOTE THE CHANGES MADE **
        enemySprite.classList.add("damage-right");
        // changes volume of damage sound depending on amount of points deducted from player's health
        enemyDamage.volume = randomDamage * .1;
        // sets the time for the sound to play at 0
        enemyDamage.currentTime = 0;
        // sound that plays when enemy takes damage
        enemyDamage.play();

        // the function we will call in the setTimeOut method below
        // after 350 milliseconds
        // this function will execute this block of code
        function changePlayerTwoSprite() {
            enemySprite.classList.remove("damage-right");
            enemySprite.classList.add("idle");

            playerSprite.src = playerTwoFrames[0];
            playerSprite.classList.remove("attack-left");
            playerSprite.classList.add("idle");
        }
        setTimeout(changePlayerTwoSprite, 350);
    }
    // amount of damage player 2 will inflict on player 1
    const randomDamage = Math.floor(Math.random()*11);
    animatePlayer(randomDamage);
    changeButtonStatus();
    changePlayer(randomDamage);

    // Commented this starter code out as it was less helpful than the functions
    // made for attackPlayerTwo function
    /*if (gameState.whoseTurn === 2) {
        let playerOneHealth = document.getElementById("playerOneHealth");
        let playerOneHealthNum = Number(playerOneHealth.innerHTML);
        playerOneHealthNum -= 10;
        playerOneHealth.innerHTML = playerOneHealthNum;

        if (playerOneHealth <= 0) {
            playerOneHealth = 0;
            gameOver();
        } else {
            changePlayer();
        }
    }*/
}