/*
 * Create a list that holds all of your cards
 */
const totalCards = 16;
const cardTypes = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
const twoStarMoves = 18;
const oneStarMoves = 24;
const cards = [];
let matches = 0;
var timer;
let seconds = 0;
let timerStarted = false;
const openCards = [];
const moveDivs = document.querySelector(".moves");
const resetButton = document.querySelector(".restart");
let moves = 0;
let starCount = 3;
for (let i = 0; i < totalCards / 2; i++) {
    const j = i * 2;
    cards[j] = cardTypes[i];
    cards[j + 1] = cardTypes[i];
}


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
shuffle(cards);
setMoves(moves);
const unorderedList = document.createElement("ul");
unorderedList.classList.add("deck");
for (let i = 0; i < cards.length; i++) {
    const listItem = document.createElement("li");
    listItem.classList.add("card");
    const card = document.createElement("i");
    card.classList.add("fa", cards[i]);
    listItem.appendChild(card);
    unorderedList.appendChild(listItem);
}
document.querySelector(".container").appendChild(unorderedList);

function updateCards() {
    matches = 0;
    moves = 0;
    setMoves(moves);
    resetStars();
    clearInterval(timer);
    seconds = -1;
    timerStarted = false;
    secondTimer();
    while (openCards.length > 0) {
        openCards.pop();
    }
    shuffle(cards);
    for (let i = 0; i < cards.length; i++) {
        const listItem = unorderedList.children[i];
        listItem.className = "card";
        const card = listItem.firstElementChild;
        card.className = "fa " + cards[i];
    }
}

function resetStars() {
    starCount = 3;
    const starsSection = document.querySelector(".stars");
    for (let i = 0; i < starsSection.childElementCount; i++) {
        const child = starsSection.children[i];
        child.firstElementChild.className = "fa fa-star";
    }
}

function removeStarIfNecessary() {
    const starsSection = document.querySelector(".stars");
    if (moves === twoStarMoves) {
        starCount--;
        starsSection.children[2].firstElementChild.className = "hide";
    } else if (moves === oneStarMoves) {
        starCount--;
        starsSection.children[1].firstElementChild.className = "hide";
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

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
function cardClicked(event) {
    if (event.target.localName === 'li') {
        if (timerStarted === false) {
            timerStarted = true;
            timer = setInterval(secondTimer, 1000);
        }
        const cardListItem = event.target;
        if (!openCards.includes(cardListItem)) {
            openCards.push(cardListItem);
            displayCard(cardListItem);
            addOpenCard(cardListItem);
        }
    }
}

function secondTimer() {
    const timerSpan = document.querySelector(".timer");
    if (seconds === 1) {
        timerSpan.nextSibling.textContent = " Seconds";
    }
    seconds++;
    timerSpan.innerHTML = seconds.toString();
    if (seconds === 1) {
        timerSpan.nextSibling.textContent = " Second";
    }
}

function displayCard(listItem) {
    listItem.classList.add('open', 'show');
}

function incrementMoves() {
    if (moves === 1) {
        const movesSpan = document.querySelector(".moves");
        movesSpan.nextSibling.textContent = " Moves";
    }
    setMoves((++moves).toString());
    if (moves === 1) {
        const movesSpan = document.querySelector(".moves");
        movesSpan.nextSibling.textContent = " Move";
    }
    removeStarIfNecessary();
}

function setMoves(movesText) {
    moveDivs.textContent = movesText;
}


function addOpenCard(listItem) {
    if (openCards.length % 2 === 0) {
        incrementMoves();
        const openedCard = listItem.firstElementChild.classList.item(1);
        const previousOpenedListItem = openCards[openCards.length - 2];
        const previousOpenedCard = previousOpenedListItem.firstElementChild.classList.item(1);
        if (openedCard === previousOpenedCard) {
            matchFound(listItem, previousOpenedListItem);
            if (++matches === totalCards / 2) {
                gameWon();
            }
        } else {
            openCards.pop();
            openCards.pop();
            matchNotFound(listItem, previousOpenedListItem);
        }
    }
}

function matchFound(cardListItem1, cardLIstItem2) {
    cardListItem1.classList.add('match');
    cardLIstItem2.classList.add('match');
}

function matchNotFound(cardListItem1, cardLIstItem2) {
    cardListItem1.classList.add('nomatch');
    cardLIstItem2.classList.add('nomatch');
    setTimeout(function () {
            cardListItem1.classList.remove('open', 'show', 'nomatch');
            cardLIstItem2.classList.remove('open', 'show', 'nomatch');
        },
        1000
    );
}

function gameWon() {
    clearTimeout(timer);
    const popup = document.getElementById("popup");
    const winDetails = document.querySelector(".winDetails");
    let suffix = "";
    if (starCount > 1) {
        suffix = "s";
    }
    winDetails.textContent = "With " + moves + " Moves in " + seconds + " seconds and " + starCount + " Star" + suffix;

    popup.style.display = "flex";
}

function resetAfterWin() {
    updateCards();
    const popup = document.getElementById("popup");
    popup.style.display = "none";
}

const popupButton = document.querySelector(".popupButton");
popupButton.addEventListener('click', resetAfterWin);
unorderedList.addEventListener('click', cardClicked);
resetButton.addEventListener('click', updateCards);
