//Game state
let gameState = {
    players: 2,
    whoseTurn: 1,
    gameOver: false
}

//All Player One components
const playerOneSprite = document.getElementById("playerOneSprite");
const playerOneHealth = document.getElementById("playerOneHealth");
const playerOneAttackButton = document.getElementById("playerOneAttack");
const playerOneFrames = [
    "./images/R_Idle.png",
    "./images/R_Attack.png"
];

//All Player Two components
const playerTwoSprite = document.getElementById("playerTwoSprite");
const playerTwoHealth = document.getElementById("playerTwoHealth");
const playerTwoAttackButton = document.getElementById("playerTwoAttack");
const playerTwoFrames = [
    "./images/L_Idle.png",
    "./images/L_Attack.png"
];

//Game board elements
const title = document.getElementById("title");
const playerTurnDisplay = document.getElementById("playerTurn");
const playerName = document.getElementById("playerName");

//End of Game elements
const gameOverScreen = document.getElementById("gameOverScreen");
const winningPlayer = document.getElementById("winningPlayer");

//Audio Elements
const enemyDamage = document.getElementById("SFX_PlayerDamage");
const successFanfare = document.getElementById("success-fanfare");

/*Background Photo: 
Photo by <a href="https://unsplash.com/@outoforbit?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Gustav Gullstrand</a> on <a href="https://unsplash.com/photos/green-pine-trees-d6kSvT2xZQo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
*/
      
/* HELPER FUNCTIONS */

/** SUB FUNCTION OF CHANGEBTNSTATUS: activateBtn
 * Enables attack button and changes UI to look active
 * @param {HTMLButtonElement} btn 
 */
function activateBtn(btn){
    btn.classList.add("active");
    btn.classList.remove("inactive");
    btn.disabled = false;
    btn.focus();
}

/** SUB FUNCTION OF CHANGEBTNSTATUS: deactivateBtn
 * Disables attack button and changes UI to look inactive
 * @param {HTMLButtonElement} btn 
 */
function deactivateBtn(btn){
    btn.classList.add("inactive");
    btn.classList.remove("active");
    btn.disabled = true;
}

/** FUNCTION: changeBtnStatus
 * Changes the button status after each turn
 */
function changeBtnStatus(){
    if (gameState.whoseTurn === 1){
        activateBtn(playerTwoAttackButton);
        deactivateBtn(playerOneAttackButton);
    }else{
        activateBtn(playerOneAttackButton);
        deactivateBtn(playerTwoAttackButton);
    }
}

/** SUB FUNCTION OF STARTATTACK: startAttack
 * Animates the start of the attack between attacker and victim
 * @param {HTMLImageElement} attacker 
 * @param {string[]} attackerFrames 
 * @param {HTMLImageElement} victim 
 * @param {number} randomDamage 
 */
function startAttack(attacker, attackerFrames, victim, randomDamage){
    attacker.src = attackerFrames[1];
    
    attacker.classList.remove("idle");
    victim.classList.remove("idle");

    if (attacker.id === 'playerOneSprite'){
        attacker.classList.add("attack-right");
        victim.classList.add("damage-left");
    }else {
        attacker.classList.add("attack-left");
        victim.classList.add("damage-right");
    }

    enemyDamage.volume = randomDamage * .1;
    enemyDamage.currentTime = 0;
    enemyDamage.play();
}

/** SUB FUNCTION OF ANIMATEPLAYER: endAttack
 * Animates the end of the attack between attacker and victim
 * @param {HTMLImageElement} attacker 
 * @param {string[]} attackerFrames 
 * @param {HTMLImageElement} victim 
 */
function endAttack(attacker, attackerFrames, victim){
    if (attacker.id === "playerOneSprite"){
        attacker.classList.remove("attack-right");
        victim.classList.remove("damage-left");
    }else{
        attacker.classList.remove("attack-left");
        victim.classList.remove("damage-right");
    }
    attacker.src = attackerFrames[0];
    attacker.classList.add("idle");
    victim.classList.add("idle");
}

/** FUNCTION: animatePlayer
 * Animates the attacker and victim moves during the round
 * @param {HTMLImageElement} attacker 
 * @param {string[]} attackerFrames 
 * @param {HTMLImageElement} victim 
 * @param {number} randomDamage 
 */
function animatePlayer(attacker, attackerFrames, victim, randomDamage){
    startAttack(attacker, attackerFrames, victim, randomDamage);
    setTimeout(() => endAttack(attacker, attackerFrames, victim), 350);
}

/** SUB FUNCTION FOR GAMEOVER: hideTitleBanner
 * Hides the title displayed during game when game is over
 */
function hideTitleBanner(){
    title.style.display = "none";
    playerTurnDisplay.style.display = "none";
}

/** SUB FUNCTION FOR GAMEOVER: displayWinner
 * Displays game over banner and winner
 */
function displayWinner(){
    winningPlayer.innerText = `Player ${gameState.whoseTurn} wins!`;
    gameOverScreen.style.display = "flex";
    gameOverScreen.style.flexDirection = "column";
}

/** SUB FUNCTION FOR GAMEOVER: disablePlayButtons
 * Used to deactivate buttons when the game ends
 */
function disablePlayButtons(){
    deactivateBtn(playerOneAttackButton);
    deactivateBtn(playerTwoAttackButton);
}

/** SUB FUNCTION FOR CHANGEPLAYER: gameOver
 * Called to change the UI, game state, and play fanfare when game ends
 */
function gameOver() {
    hideTitleBanner();
    displayWinner();
    disablePlayButtons();
    gameState.gameOver = true;
    setTimeout(() => successFanfare.play(), 750);
}

/** SUB FUNCTION FOR CHANGEPLAYER: inflictDamage
 * Reduces health of victim by randomDamage
 * @param {HTMLSpanElement} victimHealth 
 * @param {number} randomDamage 
 * @returns HTMLElement
 */
function inflictDamage(victimHealth, randomDamage){
    // converts the innerText from string to a number and stores it in a variable
    let victimHealthNum = Number(victimHealth.innerText);
    // reduces by a random number between 0 and 10
    victimHealthNum -= randomDamage;
    // resets the innerText to the new value
    victimHealth.innerText = victimHealthNum;
    return victimHealthNum;
}

/** FUNCTION: changePlayer
 * Calculates health of both players after attack, and changes player turn
 * @param {HTMLImageElement} attacker 
 * @param {HTMLSpanElement} victimHealth 
 * @param {number} randomDamage 
 */
function changePlayer(attacker, victimHealth, randomDamage){
    let currentVictimHealth = inflictDamage(victimHealth, randomDamage);
    if (currentVictimHealth <= 0){
        victimHealth.innerText = 0;
        attacker.classList.add("winner");
        gameOver();
    }else{
        gameState.whoseTurn = gameState.whoseTurn === 1 ? 2 : 1;
        playerName.innerText = `Player ${gameState.whoseTurn}`;
    }
}

/** ONCLICK FUNCTION: attackPlayerTwo
 * Called with onclick attribute on playerOneAttack button in HTML
 */
function attackPlayerTwo() {
    const randomDamage = Math.floor(Math.random()*11);
    animatePlayer(playerOneSprite, playerOneFrames, playerTwoSprite, randomDamage);
    changeBtnStatus();
    changePlayer(playerOneSprite, playerTwoHealth, randomDamage);
}

/** ONCLICK FUNCTION: attackPlayerOne
 * Called with onclick attribute on playerTwoAttack button in HTML
 */
function attackPlayerOne() {
    console.log("Attacking Player 1")
    const randomDamage = Math.floor(Math.random()*11);
    animatePlayer(playerTwoSprite, playerTwoFrames, playerOneSprite, randomDamage);
    changeBtnStatus();
    changePlayer(playerTwoSprite, playerOneHealth, randomDamage);
}