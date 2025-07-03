document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const resetButton = document.getElementById('reset-button');
    
    // カードの画像を配列で指定
    const imagePaths = [
        'images/image1.png', 'images/image2.png', 'images/image3.png', 'images/image4.png',
        'images/image5.png', 'images/image6.png', 'images/image7.png', 'images/image8.png'
    ];
    
    let flippedCards = [];
    let lockBoard = false;
    let matchedPairs = 0;

    function startGame() {
        matchedPairs = 0;
        gameBoard.innerHTML = '';
        let cardImages = [...imagePaths, ...imagePaths];
        cardImages.sort(() => 0.5 - Math.random());

        cardImages.forEach(imagePath => {
            const card = createCard(imagePath);
            gameBoard.appendChild(card);
        });
    }

    // カードのHTML要素を生成する関数（画像版）
    function createCard(imagePath) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = imagePath; // データ属性として画像のパスを保持

        //カードの裏面に画像を表示するように変更
        card.innerHTML = `
            <div class="card-face card-front">?</div>
            <div class="card-face card-back">
                <img src="${imagePath}" alt="Card Image">
            </div>
        `;

        card.addEventListener('click', flipCard);
        return card;
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === flippedCards[0]) return;

        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }

    function checkForMatch() {
        lockBoard = true;
        const [card1, card2] = flippedCards;

        // データ属性で画像のパスを比較
        if (card1.dataset.image === card2.dataset.image) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        const [card1, card2] = flippedCards;
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        card1.classList.add('matched');
        card2.classList.add('matched');

        matchedPairs++;
        resetBoard();
        
        if (matchedPairs === imagePaths.length) {
            setTimeout(() => alert('クリア！おめでとうございます！ 🎉'), 500);
        }
    }

    function unflipCards() {
        setTimeout(() => {
            const [card1, card2] = flippedCards;
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }
    
    resetButton.addEventListener('click', startGame);

    startGame();
});