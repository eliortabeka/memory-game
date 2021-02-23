"use strict"

const $audio = document.getElementById('audio'),
    $score = document.getElementById('score'),
    $step = document.getElementById('steps'),
    $timer = document.getElementById('timer'),
    $start = document.getElementById('start'),
    $board = document.getElementById('board'),
    cards = [
        {
            answer: 'lion',
            image: 'https://images.unsplash.com/photo-1573725342230-178c824a10f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxMjA3fDB8MXxhbGx8fHx8fHx8fA&ixlib=rb-1.2.1&q=80&w=1080'
        },
        {
            answer: 'sheep',
            image: 'https://www.aces.edu/wp-content/uploads/2018/11/iStock-182344013.jpg'
        },
        {
            answer: 'owl',
            image: 'https://cff2.earth.com/uploads/2018/07/02234818/Owls-and-humans-utilize-the-same-visual-processing-strategy.jpg'
        },
        {
            answer: 'eagle',
            image: 'https://upload.wikimedia.org/wikipedia/commons/1/19/%C3%81guila_calva.jpg'
        },
        {
            answer: 'elephant',
            image: 'https://static.scientificamerican.com/sciam/cache/file/83B0A26D-A020-4041-9F1EC032A8EE391A_source.jpg'
        },
        {
            answer: 'mongoose',
            image: 'https://1s2oosvtjy52xrh4r10z0zms-wpengine.netdna-ssl.com/wp-content/uploads/2019/01/cute-mongoose.jpg'
        }
    ];

let timerInterval,
    selection = [],
    timer = 120,
    steps = 0,
    score = 3;

const shuffle = (arrayOfItems) => {
    let counter = arrayOfItems.length;

    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = arrayOfItems[counter];
        arrayOfItems[counter] = arrayOfItems[index];
        arrayOfItems[index] = temp;
    }

    return arrayOfItems;
}

const countTime = () => {
    timerInterval = setInterval(() => {
        --timer;
        $timer.innerText = timer;

        if (timer === 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
}

const countStep = () => {
    ++steps;
    $step.innerText = steps;
}

const calcScore = () => {
    const rating3Limit = (cards.length / 2) + 2,
        rating2Limit = cards.length,
        rating1Limit = (cards.length * 1.5);

    const is3Stars = steps <= rating3Limit,
        is2Stars = steps >= rating2Limit && steps < rating1Limit,
        is1star = steps >= rating1Limit;

    if (is3Stars) {
        score = 3;
    } else if (is2Stars) {
        score = 2;
    } else if (is1star) {
        score = 1;
    }
    $score.innerText = score;
}

const checkIfGameOver = () => {
    const openCards = (document.getElementsByClassName('open')).length;

    if ((cards.length * 2) === openCards) {
        clearInterval(timerInterval);
        setTimeout(() => {
            Swal.fire({
                title: 'Game Over',
                icon: 'success',
                showConfirmButton: true,
                confirmButtonText: 'Play Again'
            }).then((result) => {
                if (result.isConfirmed) {
                    startGame();
                }
            })
            $start.classList.remove('hide');
        }, 800)
    }
}

const checkGameState = () => {
    countStep();
    calcScore();
    checkIfGameOver();
}

const printCards = (cardsArray) => {
    const shuffledCards = shuffle([...cardsArray, ...cardsArray]);
    $board.innerHTML = '';
    shuffledCards.forEach((card) => {
        const liElement = document.createElement('li');
        liElement.dataset.answer = card.answer;

        const imgElement = document.createElement('img');
        imgElement.src = card.image;
        imgElement.alt = card.answer;
        imgElement.title = card.answer;

        liElement.appendChild(imgElement);
        $board.appendChild(liElement);
    })
}

const startGame = () => {
    printCards(cards);
    countTime();
}

const flipCards = (isCorrect) => {
    $board.classList.add('compare');
    setTimeout(() => {
        const flippedCards = Array.from(document.getElementsByClassName('flip'));
        flippedCards.forEach(card => {
            if (isCorrect) {
                card.classList.replace('flip', 'open');
            } else {
                card.classList.remove('flip');
            }
        });
        $board.classList.remove('compare');
        checkGameState();
    }, 800);
}

$board.addEventListener('click', ($event) => {
    const isCard = $event.target.localName === 'li';
    const isOpenedCard = $event.target.classList.contains('open');
    const isFlippedCard = $event.target.classList.contains('flip');
    if (!isCard || isOpenedCard || isFlippedCard) { return; }

    const currentUserSelection = $event.target.dataset.answer;
    $event.target.classList.add('flip');
    selection.push(currentUserSelection);

    if (selection.length === 2) {
        const isCorrectAnswer = selection[0] === selection[1];
        flipCards(isCorrectAnswer);
        selection = [];
    }
})

$start.addEventListener('click', () => {
    startGame();
    $start.classList.add('hide');
})
