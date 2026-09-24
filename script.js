const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const chooseLeftButton = document.getElementById("chooseLeft");
const chooseRightButton = document.getElementById("chooseRight");
const restartButton = document.getElementById("restartGame");
const instructions = document.getElementById("instructions");
const scoreElement = document.getElementById("score");

// Last inn spillerbildene
const leftImage = new Image();
leftImage.src = "player1.png";

const rightImage = new Image();
rightImage.src = "player2.png";

// Størrelse på spillerne
const paddleWidth = 90;
const paddleHeight = 100;

// Spillerne
const leftPaddle = {
    x: 25,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 7
};

const rightPaddle = {
    x: canvas.width - paddleWidth - 25,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 7
};

// Ballen
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 11,
    speed: 5,
    dx: 5,
    dy: 3
};

const keys = {};

let controlledPlayer = null;
let leftScore = 0;
let rightScore = 0;
let gameRunning = false;
canvas.addEventListener("mousemove", function(event) {

    const rect = canvas.getBoundingClientRect();

    const mouseY =
        event.clientY - rect.top;

    if (controlledPlayer === "left") {

        leftPaddle.y =
            mouseY - leftPaddle.height / 2;

    } else if (controlledPlayer === "right") {

        rightPaddle.y =
            mouseY - rightPaddle.height / 2;
    }
    leftPaddle.y = Math.max(
    0,
    Math.min(canvas.height - leftPaddle.height,
             leftPaddle.y)
    );
    
    rightPaddle.y = Math.max(
        0,
        Math.min(canvas.height - rightPaddle.height,
                 rightPaddle.y)
    );
});

canvas.addEventListener("touchmove", function(event) {

    event.preventDefault();

    const rect = canvas.getBoundingClientRect();

    const touchY =
        event.touches[0].clientY - rect.top;

    if (controlledPlayer === "left") {

        leftPaddle.y =
            touchY - leftPaddle.height / 2;

    } else if (controlledPlayer === "right") {

        rightPaddle.y =
            touchY - rightPaddle.height / 2;
    }

}, { passive: false });

// Tastetrykk
document.addEventListener("keydown", function (event) {
    if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === " "
    ) {
        event.preventDefault();
    }

    keys[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function (event) {
    keys[event.key.toLowerCase()] = false;
});

// Velg venstre spiller
chooseLeftButton.addEventListener("click", function () {
    controlledPlayer = "left";
    gameRunning = true;

    instructions.textContent =
        "Flytt musen opp og ned for å styre spilleren";

    updateSelectedButton();
});

// Velg høyre spiller
chooseRightButton.addEventListener("click", function () {
    controlledPlayer = "right";
    gameRunning = true;

    instructions.textContent =
        "Flytt musen opp og ned for å styre spilleren";

    updateSelectedButton();
});

// Start spillet på nytt
restartButton.addEventListener("click", function () {
    leftScore = 0;
    rightScore = 0;

    leftPaddle.y = canvas.height / 2 - paddleHeight / 2;
    rightPaddle.y = canvas.height / 2 - paddleHeight / 2;

    updateScore();
    resetBall();
});

// Vis hvilken spiller som er valgt
function updateSelectedButton() {
    chooseLeftButton.classList.toggle(
        "selected",
        controlledPlayer === "left"
    );

    chooseRightButton.classList.toggle(
        "selected",
        controlledPlayer === "right"
    );
}

// Flytt spilleren som brukeren kontrollerer
function moveHumanPlayer() {
// Bevegelse styres av mus/touch.
// Ingenting skal gjøres her.
}

// Flytt datamaskinens spiller
function moveComputerPlayer() {
    if (!controlledPlayer) {
        return;
    }

    const computerPaddle =
        controlledPlayer === "left" ? rightPaddle : leftPaddle;

    const paddleCenter =
        computerPaddle.y + computerPaddle.height / 2;

    const difference = ball.y - paddleCenter;
    const computerSpeed = 4.2;

    // Dødsonen gjør at datamaskinen ikke treffer helt perfekt
    if (difference > 18) {
        computerPaddle.y += computerSpeed;
    } else if (difference < -18) {
        computerPaddle.y -= computerSpeed;
    }
}

// Sørg for at spillerne holder seg inne på banen
function keepPaddlesInsideCanvas() {
    leftPaddle.y = Math.max(
        0,
        Math.min(canvas.height - leftPaddle.height, leftPaddle.y)
    );

    rightPaddle.y = Math.max(
        0,
        Math.min(canvas.height - rightPaddle.height, rightPaddle.y)
    );
}

// Flytt ballen
function moveBall() {
    if (!gameRunning) {
        return;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Sprett mot toppen og bunnen
    if (ball.y - ball.radius <= 0) {
        ball.y = ball.radius;
        ball.dy = Math.abs(ball.dy);
    }

    if (ball.y + ball.radius >= canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.dy = -Math.abs(ball.dy);
    }

    checkPaddleCollision();

    // Høyre spiller får poeng
    if (ball.x + ball.radius < 0) {
        rightScore++;
        updateScore();
        resetBall("right");
    }

    // Venstre spiller får poeng
    if (ball.x - ball.radius > canvas.width) {
        leftScore++;
        updateScore();
        resetBall("left");
    }
}

// Kontroller kollisjon mellom ball og spiller
function checkPaddleCollision() {
    const hitsLeftPaddle =
        ball.dx < 0 &&
        ball.x - ball.radius <= leftPaddle.x + leftPaddle.width &&
        ball.x + ball.radius >= leftPaddle.x &&
        ball.y + ball.radius >= leftPaddle.y &&
        ball.y - ball.radius <= leftPaddle.y + leftPaddle.height;

    if (hitsLeftPaddle) {
        ball.x = leftPaddle.x + leftPaddle.width + ball.radius;
        ball.dx = Math.abs(ball.dx);

        changeBallDirection(leftPaddle);
    }

    const hitsRightPaddle =
        ball.dx > 0 &&
        ball.x + ball.radius >= rightPaddle.x &&
        ball.x - ball.radius <= rightPaddle.x + rightPaddle.width &&
        ball.y + ball.radius >= rightPaddle.y &&
        ball.y - ball.radius <= rightPaddle.y + rightPaddle.height;

    if (hitsRightPaddle) {
        ball.x = rightPaddle.x - ball.radius;
        ball.dx = -Math.abs(ball.dx);

        changeBallDirection(rightPaddle);
    }
}

// Endre ballens vinkel avhengig av hvor den treffer
function changeBallDirection(paddle) {
    const paddleCenter = paddle.y + paddle.height / 2;
    const relativeHitPosition =
        (ball.y - paddleCenter) / (paddle.height / 2);

    ball.dy = relativeHitPosition * 5;

    // Øk hastigheten litt for hvert treff
    ball.dx *= 1.03;

    const maximumSpeed = 10;

    if (Math.abs(ball.dx) > maximumSpeed) {
        ball.dx =
            ball.dx > 0 ? maximumSpeed : -maximumSpeed;
    }
}

// Sett ballen tilbake i midten
function resetBall(direction) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    const horizontalDirection =
        direction === "left"
            ? -1
            : direction === "right"
                ? 1
                : Math.random() < 0.5
                    ? -1
                    : 1;

    ball.dx = ball.speed * horizontalDirection;
    ball.dy = Math.random() * 4 - 2;
}

// Oppdater poengtavlen
function updateScore() {
    scoreElement.textContent = `${leftScore}–${rightScore}`;
}

// Tegn bakgrunnen
function drawBackground() {
    ctx.fillStyle = "#17324d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 14]);

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.setLineDash([]);
}

// Tegn en spiller
function drawPaddle(paddle, image, fallbackColor) {
    if (image.complete && image.naturalWidth > 0) {
        ctx.save();

        // Rund av hjørnene på spillerbildet
        ctx.beginPath();
        ctx.roundRect(
            paddle.x,
            paddle.y,
            paddle.width,
            paddle.height,
            12
        );

        ctx.clip();

        ctx.drawImage(
            image,
            paddle.x,
            paddle.y,
            paddle.width,
            paddle.height
        );

        ctx.restore();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;

        ctx.strokeRect(
            paddle.x,
            paddle.y,
            paddle.width,
            paddle.height
        );
    } else {
        // Farget spiller vises dersom bildet ikke er lastet inn
        ctx.fillStyle = fallbackColor;

        ctx.fillRect(
            paddle.x,
            paddle.y,
            paddle.width,
            paddle.height
        );
    }
}

// Tegn ballen
function drawBall() {
    ctx.beginPath();
    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.strokeStyle = "#d6b36a";
    ctx.lineWidth = 3;
    ctx.stroke();
}

// Tegn startmeldingen
function drawStartMessage() {
    if (controlledPlayer) {
        return;
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "Velg en spiller for å starte",
        canvas.width / 2,
        canvas.height / 2
    );
}

// Tegn hele spillet
function drawGame() {
    drawBackground();

    drawPaddle(leftPaddle, leftImage, "#d6b36a");
    drawPaddle(rightPaddle, rightImage, "#c98484");

    drawBall();
    drawStartMessage();
}

// Spilløkke
function gameLoop() {
    moveHumanPlayer();
    moveComputerPlayer();
    keepPaddlesInsideCanvas();
    moveBall();
    drawGame();

    requestAnimationFrame(gameLoop);
}

updateScore();
resetBall();
gameLoop();
