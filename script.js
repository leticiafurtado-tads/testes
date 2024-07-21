document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const player = document.getElementById('player');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const scoreDisplay = document.getElementById('score');
    const recordDisplay = document.getElementById('record');
    const gameSound = document.getElementById('game-sound');

    let score = 0;
    let record = localStorage.getItem('record') || 0;
    let gameInterval;
    let pieceInterval;

    recordDisplay.textContent = `Recorde: ${record}`;

    function startGame() {
        score = 0;
        scoreDisplay.textContent = `Pontuação: ${score}`;
        startButton.style.display = 'none';
        restartButton.style.display = 'none';
        player.style.left = '50%';
        gameInterval = setInterval(updateGame, 20);
        pieceInterval = setInterval(createPiece, 1000);
        gameSound.play();
    }

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(pieceInterval);
        startButton.style.display = 'none';
        restartButton.style.display = 'block';
        gameSound.pause();
        gameSound.currentTime = 0;
        if (score > record) {
            record = score;
            localStorage.setItem('record', record);
            recordDisplay.textContent = `Recorde: ${record}`;
        }
    }

    function updateGame() {
        document.querySelectorAll('.falling-piece').forEach(piece => {
            let pieceTop = parseInt(piece.style.top);
            pieceTop += 5;
            if (pieceTop > gameContainer.clientHeight) {
                piece.remove();
            } else {
                piece.style.top = `${pieceTop}px`;
                if (checkCollision(player, piece)) {
                    if (piece.classList.contains('blue-piece')) {
                        score++;
                        scoreDisplay.textContent = `Pontuação: ${score}`;
                    } else {
                        endGame();
                    }
                    piece.remove();
                }
            }
        });
    }

    function createPiece() {
        const piece = document.createElement('div');
        piece.classList.add('falling-piece');
        const isRedPiece = Math.random() < 0.1;
        piece.classList.add(isRedPiece ? 'red-piece' : 'blue-piece');
        piece.style.left = `${Math.random() * (gameContainer.clientWidth - 30)}px`;
        piece.style.top = '0px';
        gameContainer.appendChild(piece);
    }

    function checkCollision(player, piece) {
        const playerRect = player.getBoundingClientRect();
        const pieceRect = piece.getBoundingClientRect();
        return !(playerRect.right < pieceRect.left || 
                 playerRect.left > pieceRect.right || 
                 playerRect.bottom < pieceRect.top || 
                 playerRect.top > pieceRect.bottom);
    }

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);

    document.addEventListener('mousemove', (event) => {
        const gameRect = gameContainer.getBoundingClientRect();
        let playerLeft = event.clientX - gameRect.left - player.clientWidth / 2;
        if (playerLeft < 0) playerLeft = 0;
        if (playerLeft > gameRect.width - player.clientWidth) playerLeft = gameRect.width - player.clientWidth;
        player.style.left = `${playerLeft}px`;
    });

    document.addEventListener('touchmove', (event) => {
        const gameRect = gameContainer.getBoundingClientRect();
        let playerLeft = event.touches[0].clientX - gameRect.left - player.clientWidth / 2;
        if (playerLeft < 0) playerLeft = 0;
        if (playerLeft > gameRect.width - player.clientWidth) playerLeft = gameRect.width - player.clientWidth;
        player.style.left = `${playerLeft}px`;
    });
});
