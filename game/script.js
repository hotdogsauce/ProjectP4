// GLOBAL VARS

// SET PLAYERS
let player1 = "Player 1";
let player2 = "Player 2";

// STORE DOM ELEMENTS - BUTTONS, CARDS, GRID ORDER PROP, MESSAGES & GAME OVER DISPLAYS
let disableButton = document.querySelector(".flip-btn");
let cardList = document.querySelectorAll(".card");
let grid = document.querySelectorAll("section");
let msgDisplay = document.getElementById("msg-display");
let pvpDisplay = document.getElementById("pvp-display");
let winnerTitle = document.getElementById("winner-title");
let winnerName = document.getElementById("winner-name");

// ELEMENTS FOR USE IN THE SCOREBOARD
let player1NameDisplay = document.getElementById("player-1-name");
let player2NameDisplay = document.getElementById("player-2-name");
let player1ScoreDisplay = document.getElementById("player-1-score");
let player2ScoreDisplay = document.getElementById("player-2-score");
let player1Victories = document.getElementById("player-1-victories");
let player2Victories = document.getElementById("player-2-victories");

// IN-GAME AUDIO - CHECK THAT BROWSER IS NOT BLOCKING!
let laser = new Audio("media/sound/laser.flac");
let collect = new Audio("media/sound/collect.wav");
let gameOver = new Audio("media/sound/game-over.mp3");
let alienSound = new Audio("media/sound/alien_sound.mp3");
let battleTheme = new Audio("media/sound/battleThemeA.mp3");
let runSillyGirl = new Audio("media/sound/Run, silly girl, run.mp3");
let sodiumVapor = new Audio("media/sound/Sodium Vapor.mp3");
let starlight = new Audio("media/sound/starlight.mp3");
let theYFiles = new Audio("media/sound/the_y_files.mp3");

// ADD TRACKS TO AN ARRAY WHICH WILL LATER OUTPUT RANDOM TRACK ON GAME START 
const AUDIO_ARRAY = [
    battleTheme,
    runSillyGirl,
    sodiumVapor,
    starlight,
    theYFiles
];

// INITIALISE VAR TO ENABLE GAME TO BE TWO PLAYERS
let currentPlayer = 1;

// INITIALISE SCORES FOR BOTH PLAYERS AT ZER0
let player1Score = 0;
let player2Score = 0;

// RETRIEVE LOCAL STORAGE FOR EACH PLAYER'S PREVIOUS WINS
let winHistoryP1 = localStorage.getItem("P1-wins");
let winHistoryP2 = localStorage.getItem("P2-wins");

// DECLARE VAR TO LATER TRACK CARD PAIRS FOUND, THUS DECLARE GAME OVER
let pairsFoundCount = 0;

// TRACK WHETHER ANY CARDS HAVE BEEN FLIPPED ALREADY
let hasFlippedCard = false;
// THESE VARS WILL BE INITIALISED ON CLICKING THE TWO CARDS, USING 'this' KEYWORD
let firstCard, secondCard;
// SET VAR TO STOP BOARD BEING CLICKED UNDER CERTAIN CONDITIONS 
let lockBoard = false;

// DECLARE MESSAGE ARRAY FOR DISPLAY ON EACH PLAYER'S TURN (RANDOMISED LATER)
const MESSAGE_ARRAY = [
    "you can do this!",
    "you're up next!",
    "go get 'em!",
    "seek and destroy!",
    "kick some ass!",
    "it's finders, keepers!",
    "take 'em down!",
    "prepare for a close encounter!",
    "blast 'em!",
    "put them back into orbit!"
];

// FUNCTION LIST

// SET FUNCTIONS TO KEEP TRACK OF ANY WINS FROM EACH PLAYER
function updateWinHistoryP1() {
    // INCREMENT WIN COUNT
    winHistoryP1++;
    // SAVE WINCOUNT TO LOCAL STORAGE & DISPLAY IT ON SCOREBOARD
    localStorage.setItem("P1-wins", winHistoryP1);
    player1Victories.textContent = winHistoryP1;
};

// AS ABOVE, FOR P2
function updateWinHistoryP2() {
    winHistoryP2++;
    localStorage.setItem("P2-wins", winHistoryP2);
    player2Victories.textContent = winHistoryP2;
};

// PLAY RANDOM TRACK ON GAME START (AFTER NAME INPUT)
function playRandomTrack() {
    randomTrack.play();
    randomTrack.loop = true;
};

// DISPLAY WHO GOES FIRST IN DOM - ATTACHED TO LISTENER TO RUN AFTER ANIMATION
function firstPlayer() {
    msgDisplay.textContent = `${player1}, you get to go first. Let's get it on!`;
};

/* SHOW ALL CARDS FOR A SET TIME PERIOD AFTER 'PREVIEW' BTN CLICKED - 15 SEC DURATION
NOTE: THIS OPTION IS ONLY AVAILABLE BEFORE ANY CARDS ARE FLIPPED - PLAYERS HAVE A CHOICE WHETHER TO USE THIS OPTION BEFORE THEY START, OR PLAY WITHOUT IT */
function flipAll() {
    // DISABLE BUTTON ONCE CLICKED
    disableButton.disabled = "true";
    // DISABLE BOARD ONCE CLICKED (STOP PLAYER SELECTING CARDS)
    lockBoard = true;
    // SET TIMEOUT OF 15 SECS & FLIP CARDS, THEN TURN CARDS BACK OVER
    setTimeout(() => {
        cardList.forEach(card => {
            card.classList.add("flipped");
            setTimeout(() => {
                card.classList.remove("flipped");
                // RE-ENABLE THE BOARD SO THAT GAME CAN CONTINUE
                lockBoard = false;
            }, 15000);
        });
        // SHORT 1S DELAY BEFORE CARDS TURN OVER
    }, 1000);
};

// ONCE 10 PAIRS ARE FOUND, GAME IS OVER - DECLARE WINNER & AWARD 'WIN' BADGE
function winCheck() {
    if (pairsFoundCount === 10) {
        declareWinOrDraw();
        awardWinBadge();
    }
};

// DECLARE WINNER OR CHECK FOR DRAW SITUATION
function declareWinOrDraw() {
    // IF P1 WINS, ADD NAME TO WIN ANIMATION AND UPDATE WIN COUNT
    if (player1Score > player2Score) {
        winnerTitle.textContent = "Winner: ";
        winnerName.textContent = player1;
        updateWinHistoryP1();
    }
    // IF P2 WINS, ADD NAME TO WIN ANIMATION AND UPDATE WIN COUNT
    if (player2Score > player1Score) {
        winnerTitle.textContent = "Winner: ";
        winnerName.textContent = player2;
        updateWinHistoryP2();
    }
    // IF DRAW, ADD DRAW TO ENDGAME SCREEN INSTEAD
    if (player1Score === player2Score) {
        winnerTitle.textContent = "Draw!";
    }
    // AWARD ANY MEDALS EARNED & DISPLAY GAME OVER SCREEN
    awardMedals();
    endOfGameScreen();
};

// DISPLAY GAME OVER SCREEN
function endOfGameScreen() {
    // PAUSE ANY MUSIC STILL RUNNING & PLAY 'GAME OVER' THEME
    randomTrack.pause();
    gameOver.play();
    // REMOVE LISTENER FROM PLAYER VS PLAYER MESSAGE TO STOP IT DISPLAYING AGAIN
    pvpDisplay.removeEventListener("animationend", firstPlayer);
    // DISPLAY GAME OVER IN DOM
    pvpDisplay.textContent = "Game Over!";
    // SHOW NEW DOM ELEMENT & REMOVE ENTIRE GAME AREA FROM DOM
    document.querySelector(".span-container").style.display = "block";
    document.querySelector(".game-area").style.display = "none";
    // DISPLAY INSTRUCTIVE TEXT TO USER
    msgDisplay.textContent = "Thank you for playing! Please click 'Reset Game' to play again.";
};

// FLIP CARDS WHEN CLICKED
function turnOver() {
    // PLAY LASER SFX ON CLICK
    laser.play();
    // IF BOARD IS LOCKED OR CARD IS FIRST CARD, DO NOT PROCEED WITH FUNCTION
    if (lockBoard) return;
    if (this === firstCard) return;
    // ADD CLASS TO FLIP CARD
    this.classList.add("flipped");
    // EDGE CASE: PREVENT THE 'REVEAL CARDS' BUTTON BEING USED ONCE GAME HAS STARTED
    disableButton.disabled = "true";
    // ALLOW ONE CARD TO BE FLIPPED
    if (!hasFlippedCard) {
        // 1ST CLICK - CHANGED BOOLEAN TO ALLOW ONLY ONE OTHER CLICK
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    // 2ND CLICK, CHECK SCORE CONDITIONS & MANAGE PLAYER TURNS
    secondCard = this;
    checkForMatch();
    turnManager();
};

// CREATE FUNCTION TO TRACK MAIN SCORING CONDITIONS
function checkForMatch() {
    // CHECK IF CARDS MATCH BY DATASET
    let isMatch = firstCard.dataset.image === secondCard.dataset.image;
    // LEAVE CARDS FLIPPED IF THEY MATCH : TURN CARDS BACK OVER IF NO MATCH
    isMatch ? disableCards() : unflipCards();

    // INCREMENT HOW MANY PAIRS FOUND IF MATCH & PLAY ALIEN DEATH SOUND!
    if (isMatch) {
        pairsFoundCount++;
        alienSound.play();
    }
    // INCREASE SCORE FOR P1: DISPLAY MESSAGE IN ALERT & SCOREBOARD
    if (isMatch && currentPlayer === 1) {
        player1Score++;
        alert("Pair found! Player 1 scored a point!");
        player1ScoreDisplay.textContent = player1Score;
    }
    // INCREASE SCORE FOR P2: DISPLAY MESSAGE IN ALERT & SCOREBOARD
    if (isMatch && currentPlayer === 2) {
        player2Score++;
        alert("Pair found! Player 2 scored a point!");
        player2ScoreDisplay.textContent = player2Score;
    }
    // CHECK HOW MANY PAIRS HAVE BEEN FOUND - IF 10, GAME MUST BE OVER
    winCheck();
};

// DISABLE CARDS AFTER 2 CARDS HAVE ALREADY BEEN FLIPPED
function disableCards() {
    // REMOVE LISTENER TO DISALLOW FURTHER CLICKS
    firstCard.removeEventListener("click", turnOver);
    secondCard.removeEventListener("click", turnOver);
    // MATCHING CARDS EXIT THE BOARD - 2s DELAY 
    if (firstCard.dataset.image === secondCard.dataset.image) {
        // EDGE CASE FIX: CARD NOT FLIPPED BEFORE BEING EJECTED - USE CSS 
        firstCard.style.animation = "slide-up 4s ease-out 2s forwards";
        secondCard.style.animation = "slide-left 4s ease-out 2s forwards";
    }
    // RESET VALUES FOR LOCK BOARD & ANY FLIPPED CARDS SO GAME CAN CONTINUE AGAIN
    resetBoard();
};

// TURN CARDS OVER AUTOMATICALLY AFTER BEING FLIPPED & MATCH NOT FOUND
function unflipCards() {
    // LOCK BOARD TO PREVENT MORE THAN 2 CARDS BEING CLICKED
    lockBoard = true;
    // AFTER 2s, TURN OVER BOTH CARDS THAT AREN'T A MATCH
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        // RESET VALUES AGAIN & CONTINUE GAME
        resetBoard();
    }, 2000);
};

// RESET VALUES TO ALLOW MULTIPLE PLAYS (OTHERWISE ONLY 2 CARDS CAN BE FLIPPED!)
function resetBoard() {
    // ES6 DESTRUCTURING FOR CONCISION / REFACTORING 
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
};

// EMPLOY FUNCTION TO TRACK WHOSE TURN IT IS & OUTPUT IN UI ACCORDINGLY
function turnManager() {
    // FUNCTION KILLSWITCH ON GAME OVER, PREVENT TURN MESSAGE DISPLAYING AT END
    if (pairsFoundCount === 10) return;
    // DISPLAY RANDOM MOTIVATIONAL MESSAGE TO EACH PLAYER
    let randomMessage = MESSAGE_ARRAY[Math.floor(Math.random() * MESSAGE_ARRAY.length)];
    // ALTERNATE TURNS BETWEEN P1 & P2, INFORMING USERS WHO GOES NEXT
    if (currentPlayer === 1) {
        currentPlayer = 2;
        msgDisplay.textContent = `${player1}, your turn has ended. ${player2}: ${randomMessage}`;
    } else {
        currentPlayer = 1;
        msgDisplay.textContent = `${player2}, your turn has ended. ${player1}: ${randomMessage}`;
    }
};

// IMMEDIATELY INVOKED FUNCTION EXPRESSION CARD SHUFFLE EACH TIME PAGE IS LOADED
(function shuffleBoard() {
    // GET EACH CARD BY HTML CONTAINER SECTION, USING CSS GRID ORDER VALUE TO SHUFFLE
    grid.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    })
})();

// REBOOT GAME WHEN RESET BUTTON IS CLICKED
function reset() {
    let confirmReset = confirm("Are you sure you wish to reset the game?");
    // CONFIRM RESET WITH USER BEFORE RELOADING
    if (confirmReset) {
        location.reload();
    }
};

// AWARD A TROPHY TO THE WINNER'S SECTION OF THE SCOREBOARD (GAME OVER & THROUGHOUT)
function awardWinBadge() {
    // CREATE NEW IMAGE (WIN BADGE) IN THE DOM & SET ATTRIBUTES
    let getBadge = document.createElement("img");
    getBadge.setAttribute("src", "media/awards/win-badge.svg");
    getBadge.setAttribute("alt", "Win badge");
    getBadge.style.marginLeft = "20px";
    getBadge.classList.add("win-badge-image");
    // AWARD THAT WIN BADGE TO GAME WINNER (NOT SAVED TO LOCAL STORAGE)
    if (player1Score > player2Score) {
        player1ScoreDisplay.appendChild(getBadge);
    } else if (player2Score > player1Score) {
        player2ScoreDisplay.appendChild(getBadge);
    }
};

// AWARD MEDALS / RANK TO PLAYERS ON 1, 2 & 3 WINS
function awardMedals() {
    // GET EACH MEDAL IMAGE READY FOR INSERTION
    let p1VeteranMedal = document.getElementById("p1-vet");
    let p1ProMedal = document.getElementById("p1-pro");
    let p1EliteMedal = document.getElementById("p1-elite");
    let p2VeteranMedal = document.getElementById("p2-vet");
    let p2ProMedal = document.getElementById("p2-pro");
    let p2EliteMedal = document.getElementById("p2-elite");

    /* ADD MEDALS DEPENDENT ON PLAYER WIN HISTORY
    USE parseInt, OTHERWISE CASES MUST BE TYPED AS A STRING DUE TO LOCAL STORAGE */

    // FOR PLAYER 1, ASSIGN A MEDAL (WITH SFX) AT 1, 2 & 3 WINS RESPECTIVELY...
    if (parseInt(winHistoryP1) >= 1) {
        p1VeteranMedal.style.display = "block";
        collect.play();
        if (parseInt(winHistoryP1) >= 2) {
            p1ProMedal.style.display = "block";
            collect.play();
            if (parseInt(winHistoryP1) >= 3) {
                p1EliteMedal.style.display = "block";
                collect.play();
            }
        }
    }
    // ...AND SAME FOR PLAYER 2
    if (parseInt(winHistoryP2) >= 1) {
        p2VeteranMedal.style.display = "block";
        collect.play();
        if (parseInt(winHistoryP2) >= 2) {
            p2ProMedal.style.display = "block";
            collect.play();
            if (parseInt(winHistoryP2) >= 3) {
                p2EliteMedal.style.display = "block";
                collect.play();
            }
        }
    }
};

// RESET WIN HISTORY OF BOTH PLAYERS (CLEAR BROWSER STORAGE)
function resetWinHistory() {
    // CHECK THAT USER ACTUALLY WANTS TO RESET WIN HISTORY
    let confirmWinReset = window.confirm("Are you sure that you wish to clear win history? This will clear win history for both players, which cannot be undone. \n\nContinue?");
    // IF 'OK' CLICKED, WIPE ALL PREVIOUS WIN COUNTS FROM STORAGE & SCOREBOARD
    if (confirmWinReset) {
        // RE-ENABLE 'SHOW CARDS' BUTTON FOR THE NEXT ROUND
        disableButton.disabled = "false";
        // CLEAR WINS IN LOCAL STORAGE & RESET ON SCOREBOARD
        localStorage.removeItem("P1-wins");
        localStorage.removeItem("P2-wins");
        player1Victories.textContent = "";
        player2Victories.textContent = "";
        // GRAB ALL RELEVANT MEDAL IMAGES AS A NODELIST ARRAY, READY FOR REMOVAL
        let getAllMedals = document.querySelectorAll(".medal-image");
        // LOOP THROUGH AWARDED MEDALS & RE-HIDE THEM
        for (i = 0; i < getAllMedals.length; i++) {
            getAllMedals[i].style.display = "none";
        }
        // INFORM USER THAT PAGE WILL NOW RELOAD
        alert("The page will now reload for changes to take effect.");
        // RELOAD PAGE TO CLEAR REMAINING STORAGE & BEGIN AFRESH
        location.reload();
    }
};

// GAME FLOW & SETUP

// INITIALISE RANDOM TRACK FROM MUSIC ARRAY & LOOP
let randomTrack = AUDIO_ARRAY[Math.floor(Math.random() * AUDIO_ARRAY.length)];

playRandomTrack();

// ENSURE ACCUMULATED MEDALS ARE DISPLAYED AT START OF GAME, EVEN AFTER PAGE RELOAD
awardMedals();

// RUN THE ANIMATION THAT DISPLAYS THE VERSUS MATCHUP AFTER NAME INPUT
pvpDisplay.textContent = `${player1} VS ${player2}: PREPARE FOR BATTLE !`;
pvpDisplay.style.animation = "matchup 4s ease-in-out forwards";

// WAIT FOR PLAYER VS PLAYER ANIMATION TO END BEFORE DISPLAYING WHO GOES FIRST
pvpDisplay.addEventListener("animationend", firstPlayer);

// INSERT SCOREBOARD INFO - PLAYER NAMES & ANY WINS ACCUMULATED PREVIOUSLY
player1NameDisplay.textContent = player1;
player2NameDisplay.textContent = player2;
player1Victories.textContent = winHistoryP1;
player2Victories.textContent = winHistoryP2;

// LISTEN FOR EACH CARD CLICK & TURN CARD OVER
cardList.forEach((card) => card.addEventListener("click", turnOver));