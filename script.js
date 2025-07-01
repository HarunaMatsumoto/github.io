document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const resetButton = document.getElementById('reset-button');
    // カードの絵柄（絵文字）
    const symbols = ['😺', '😹', '😻', '😾', '🙀', '😽', '😸', '😼'];
    let cards = [];
    let flippedCards = [];
    let lockBoard = false; // ボードをロックして連続クリックを防ぐ
    let matchedPairs = 0;

    // ゲームを初期化して開始する関数
    function startGame() {
        matchedPairs = 0;
        gameBoard.innerHTML = '';
        // シンボルを2つずつペアにしてカード配列を作成
        let cardSymbols = [...symbols, ...symbols];
        // カードをシャッフル
        cardSymbols.sort(() => 0.5 - Math.random());

        cardSymbols.forEach(symbol => {
            const card = createCard(symbol);
            gameBoard.appendChild(card);
        });
    }

    // カードのHTML要素を生成する関数
    function createCard(symbol) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;

        card.innerHTML = `
            <div class="card-face card-front">?</div>
            <div class="card-face card-back">${symbol}</div>
        `;

        card.addEventListener('click', flipCard);
        return card;
    }

    // カードをクリックした時の処理
    function flipCard() {
        if (lockBoard) return; // ボードがロックされている場合は何もしない
        if (this === flippedCards[0]) return; // 同じカードをクリックしても何もしない

        this.classList.add('flipped');

        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }

    // 2枚のカードが一致するかチェックする関数
    function checkForMatch() {
        lockBoard = true; // 2枚めくったらボードをロック
        const [card1, card2] = flippedCards;

        if (card1.dataset.symbol === card2.dataset.symbol) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    // カードが一致した場合の処理
    function disableCards() {
        const [card1, card2] = flippedCards;
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        card1.classList.add('matched');
        card2.classList.add('matched');

        matchedPairs++;
        resetBoard();
        
        // 全てのペアが揃ったらアラート
        if (matchedPairs === symbols.length) {
            setTimeout(() => alert('クリア！おめでとうございます！ 🎉'), 500);
        }
    }

    // カードが一致しなかった場合の処理
    function unflipCards() {
        setTimeout(() => {
            const [card1, card2] = flippedCards;
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            resetBoard();
        }, 1000); // 1秒後にカードを裏返す
    }

    // ボードの状態をリセットする
    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }
    
    // リセットボタンのイベント
    resetButton.addEventListener('click', startGame);

    // ゲーム開始
    startGame();
});
