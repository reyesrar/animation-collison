import {
    frameWidth,
    movePlayer, handleKeyDown, handleKeyUp,
    drawPlayer, getPlayerCollisionBox,
    resetPlayer, initPlayer
} from './player.js';
import {
    zubatFrameWidth, zubatFrameHeight,
    zubats, setZubatCry, playZubatCry,
    createZubat, setInitialZubatPosition,
    moveZubat, drawZubat, getZubatCollisionBox
} from './zubat.js';

// --- INITIALIZATIONS ---
const canvas = document.getElementById('spriteCanvas');
const ctx = canvas.getContext('2d');

const bgm = new Audio('./assets/sound/bgm.mp3');
bgm.loop = false;
bgm.volume = 0.5;
let loopInterval = null;

const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

const background = new Image();
background.src = './assets/image/background.png';

const sprite = new Image();
sprite.src = './assets/image/player.png';

const zubatImg = new Image();
zubatImg.src = './assets/image/zubat.png';

// --- PLAYER & ZUBAT INIT ---
initPlayer(canvas);
setZubatCry(new Audio('./assets/sound/zubat.mp3'));
setInitialZubatPosition(canvas, frameWidth);

// --- GAME STATE ---
let animationStarted = false;
let animationStopped = false;
let score = 0;
let scoreInterval = null;
let zubatSpeedInterval = null;
let zubatSpawnInterval = null;

// --- SCORE ---
function startScore() {
    if (scoreInterval) return;
    scoreInterval = setInterval(() => {
        if (!animationStopped) {
            score++;
        }
    }, 1000);
}
function stopScore() {
    if (scoreInterval) {
        clearInterval(scoreInterval);
        scoreInterval = null;
    }
}
function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Puntuación: " + score, 20, 40);

    ctx.font = "24px Arial";
    ctx.fillStyle = "yellow";
    ctx.textAlign = "right";
    ctx.fillText(highestScore + " :HG", canvas.width - 20, 40);
    ctx.textAlign = "left";
}

// --- HIGHEST SCORE ---
let highestScore = Number(localStorage.getItem('highestScore')) || 0;

function updateHighestScore() {
    if (score > highestScore) {
        highestScore = score;
        localStorage.setItem('highestScore', highestScore);
    }
}

// --- ZUBAT INTERVALS ---
function startIntervals() {
    stopIntervals();
    zubatSpeedInterval = setInterval(() => {
        if (!animationStopped && animationStarted) {
            const speedUpFactor = 2;
            zubats.forEach(z => {
                z.vx *= speedUpFactor;
                z.vy *= speedUpFactor;
            });
            playZubatCry();
        }
    }, 10000);

    zubatSpawnInterval = setInterval(() => {
        if (!animationStopped && animationStarted) {
            zubats.push(createZubat(canvas, frameWidth));
        }
    }, 50000);
}
function stopIntervals() {
    if (zubatSpeedInterval) {
        clearInterval(zubatSpeedInterval);
        zubatSpeedInterval = null;
    }
    if (zubatSpawnInterval) {
        clearInterval(zubatSpawnInterval);
        zubatSpawnInterval = null;
    }
}

// --- COLLISION ---
function isColliding(ax, ay, aw, ah, bx, by, bw, bh) {
    return (
        ax < bx + bw &&
        ax + aw > bx &&
        ay < by + bh &&
        ay + ah > by
    );
}

// --- GAME STATE ---
function startGame() {
    if (animationStarted) return;
    animationStarted = true;
    animationStopped = false;
    startBtn.style.display = 'none';
    canvas.style.display = 'block';
    restartBtn.style.display = 'none';
    startScore();
    startIntervals();
    startBGM();
    requestAnimationFrame(animate);
}
startBtn.addEventListener('click', startGame);

function resetGame() {
    resetPlayer(canvas);
    setInitialZubatPosition(canvas, frameWidth);
    score = 0;
    animationStopped = false;
    animationStarted = true;
    restartBtn.style.display = 'none';
    startScore();
    startIntervals();
    startBGM();
    requestAnimationFrame(animate);
}
restartBtn.addEventListener('click', resetGame);

// --- ANIMATION ---
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (background.complete) {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    }

    drawScore();

    if (animationStopped) {
        updateHighestScore();
        drawPlayer(ctx, sprite);
        zubats.forEach(z => {
            ctx.drawImage(
                zubatImg,
                z.frame * zubatFrameWidth, 0,
                zubatFrameWidth, zubatFrameHeight,
                z.x, z.y,
                zubatFrameWidth, zubatFrameHeight
            );
        });
        stopScore();
        stopIntervals();
        stopBGM();
        return;
    }

    movePlayer(canvas);
    drawPlayer(ctx, sprite);

    zubats.forEach(z => {
        if (zubatImg.complete) {
            moveZubat(z, canvas, frameWidth);
            drawZubat(ctx, zubatImg, z);
        }
    });

    // --- PLAYER COLLISION BOX ---
    //drawPlayerCollisionBox(ctx);

    //  --- ZUBAT COLLISION BOXES ---
    for (let z of zubats) {
        //drawZubatCollisionBox(ctx, z);
        const pBox = getPlayerCollisionBox();
        const zBox = getZubatCollisionBox(z);
        if (
            isColliding(
                pBox.x, pBox.y, pBox.w, pBox.h,
                zBox.x, zBox.y, zBox.w, zBox.h
            )
        ) {
            animationStopped = true;
            restartBtn.style.display = 'block';
            stopBGM();
            updateHighestScore();
            return;
        }
    }

    requestAnimationFrame(animate);
}

// --- BGM ---
const loopStart = 2.80;
const loopEnd = 89.0;
function startBGM() {
    bgm.currentTime = 0;
    bgm.play();
    if (loopInterval) clearInterval(loopInterval);
    loopInterval = setInterval(() => {
        if (bgm.currentTime >= loopEnd) {
            bgm.currentTime = loopStart;
            bgm.play();
        }
    }, 200);
}
function stopBGM() {
    bgm.pause();
    if (loopInterval) {
        clearInterval(loopInterval);
        loopInterval = null;
    }
}

// --- PLAYER KEYBOARD EVENTS ---
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);