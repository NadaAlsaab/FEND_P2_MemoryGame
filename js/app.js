/*
 * Create a list that holds all of your cards
 */

 const deck = document.querySelector('.deck');
 let clickedCards = [];
 let matchedCards = [];
 let moves = 0;
 let clockOn = false;
 let time = 0;
 let clockID;
 const CARDS_PAIRS_NUM = 8;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


// ------ Start Game -------
// event addEventListener
deck.addEventListener('click', function () {

  // start timer
  if(clockOn !== true){
    startClock();
    clockOn = true;
  }

  // flip card & display its symbol
  // 1- save the required target object
  const clicked = event.target;

  // 2- check if the clicked objects are cards & not matched
  if (clicked.classList.contains('card') &&
		clickedCards.length < 2 &&
		!clicked.classList.contains('match') &&
		!clickedCards.includes(clicked)) {
		toggleClass(clicked);
		addToggleClass(clicked);
    // add the mathced cards ..
		if (clickedCards.length === 2) {
			matchCheck(clicked);
			addMove();
			starsCalc();
		}
  }
});

// shuffle cards
shuffleDeck()

// toggle
document.querySelector('.popup__cancel').addEventListener('click', function () {
	toggleModal();
});

// restart
document.querySelector('.restart').addEventListener('click', resetGame);

// replay
document.querySelector('.popup__replay').addEventListener('click', replayGame);



// -----------GAME functions--------------
// function to shuffle the deck
function shuffleDeck() {
	const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
	const shuffled = shuffle(cardsToShuffle);
	for (card of shuffled) {
		deck.appendChild(card)
	}
}

// function to toggle the model
function toggleModal() {
	const modal = document.querySelector('.popup__background');
	modal.classList.toggle('hide');
}

// funvtion to write stats
function writeModalStats() {
	const timeStat = document.querySelector('.popup__time');
	const clockTime = document.querySelector('.clock').innerHTML;
	const movesStat = document.querySelector('.popup__moves');
	const starsStat = document.querySelector('.popup__stars');
	const stars = getStars();

	timeStat.innerHTML = `Time = ${clockTime}`;
	movesStat.innerHTML = `Moves = ${moves}`;
	starsStat.innerHTML = `Stars = ${stars}`;
}

// ----RESET----- functions

// function to reset the game
function resetGame() {
	clickedCards = [];
  matchedCards = [];
  resetCards();
  shuffleDeck();
	resetTime();
	resetMoves();
	resetStars();
}

// function to replay the game
function replayGame() {
	resetGame();
	toggleModal();
}

// function to stop the game (game over)
function gameOver() {
	stopClock();
	writeModalStats();
	toggleModal();
}

// reset time
function resetTime() {
	stopClock();
	clockOff = true;
	time = 0;
	displayTime();
}

// reset moves
function resetMoves() {
	moves = 0;
	document.querySelector('.moves').innerHTML = moves;
}

// reset stars
function resetStars() {
	stas = 0;
	const stars = document.querySelectorAll('.stars li');
	for (star of stars) {
		star.style.display = 'inline';
		}
}

// reset cards
function resetCards() {
	const cards = document.querySelectorAll('.deck li');
	for (let card of cards) {
    card.className = 'card'
	}
}

// -----------CARDS functions--------------

// function to open and show the clicked card
function toggleClass(clicked) {
	clicked.classList.toggle('open');
	clicked.classList.toggle('show');
}

// function to add the clicked cards
function addToggleClass(clicked) {
	clickedCards.push(clicked);
}

// function to check if the 2 clicked cards are matched or not
function matchCheck(){
  if (clickedCards[0].firstElementChild.className ===
    clickedCards[1].firstElementChild.className) {
		setTimeout(function() {
			clickedCards[0].classList.toggle('match');
			clickedCards[1].classList.toggle('match');
			clickedCards = [];
      matchedCards.push(clickedCards[0], clickedCards[1]);
			if (matchedCards.length === CARDS_PAIRS_NUM*2) {
				gameOver();
			}
		}, 700)

	} else {
		setTimeout(notMatch, 1000);
	}
}

// function if cards are not matched
function notMatch() {
  toggleClass(clickedCards[0]);
	toggleClass(clickedCards[1]);
	clickedCards = [];
}

// function to calculate moves of the game
function addMove() {
	moves++;
	const movesText = document.querySelector('.moves')
	movesText.innerHTML = moves;
}

// function to decrement the stars based on the moves
function starsCalc() {
	if (moves === 10 || moves === 20 || moves == 30 ) { // decrement
    const stars = document.querySelectorAll('.stars li')
  	for (star of stars) {
  		if (star.style.display !== 'none') {
  			star.style.display = 'none';
  			break;
  		}
  	}
	}
}

// function to get stars number
function getStars() {
	stars = document.querySelectorAll('.stars li');
	starCount = 0;
	for (star of stars) {
		if (star.style.display !== 'none') {
			starCount++;
		}
	}
	return starCount
}

// -----------TIME functions--------------
// function to start the clock
function startClock() {
	clockID = setInterval( function() {
		time++;
		displayTime();
	}, 1000);
}

// function to display the clock time
function displayTime() {
	const clock = document.querySelector('.clock');

	//convert time to minutes and seconds
	const seconds = time % 60;
	const minutes = Math.floor(time / 60);
	if (seconds < 10) {
		clock.innerHTML = `${minutes}:0${seconds}`;
	} else {
		clock.innerHTML = `${minutes}:${seconds}`;
	}
}

// function to stop the clock
function stopClock() {
    clearInterval(clockID);
}
