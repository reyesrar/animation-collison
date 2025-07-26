export const frameWidth = 64;
export const frameHeight = 64;

export let playerState = 'down';
export let actualFrame = 0;
export const frameDelay = 10;

export let playerX;
export let playerY;
export const speed = 2;

export const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

export const spriteAnimations = [];
export const animationStates = [
    { name: 'down', frames: 4 },
    { name: 'left', frames: 4 },
    { name: 'right', frames: 4 },
    { name: 'up', frames: 4 }
];

export function initPlayer(canvas) {
    playerX = (canvas.width - frameWidth) / 2;
    playerY = (canvas.height - frameHeight) / 2;
    playerState = 'down';
    actualFrame = 0;

    animationStates.forEach((state, index) => {
        let frames = { loc: [] };
        for (let i = 0; i < state.frames; i++) {
            let positionX = i * frameWidth;
            let positionY = index * frameHeight;
            frames.loc.push({ x: positionX, y: positionY });
        }
        spriteAnimations[state.name] = frames;
    });
}

export function movePlayer(canvas) {
    if (keys.up) playerY -= speed;
    if (keys.down) playerY += speed;
    if (keys.left) playerX -= speed;
    if (keys.right) playerX += speed;

    const margin = frameWidth;
    playerX = Math.max(margin, Math.min(canvas.width - frameWidth - margin, playerX));
    playerY = Math.max(margin, Math.min(canvas.height - frameHeight - margin, playerY));
}

export function handleKeyDown(e) {
    switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'w':
        case 's':
            e.preventDefault();
            break;
    }
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            keys.up = true;
            playerState = 'up';
            break;
        case 'ArrowDown':
        case 's':
            keys.down = true;
            playerState = 'down';
            break;
        case 'ArrowLeft':
        case 'a':
            keys.left = true;
            playerState = 'left';
            break;
        case 'ArrowRight':
        case 'd':
            keys.right = true;
            playerState = 'right';
            break;
    }
}

export function handleKeyUp(e) {
    switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'w':
        case 's':
            e.preventDefault();
            break;
    }
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            keys.up = false;
            break;
        case 'ArrowDown':
        case 's':
            keys.down = false;
            break;
        case 'ArrowLeft':
        case 'a':
            keys.left = false;
            break;
        case 'ArrowRight':
        case 'd':
            keys.right = false;
            break;
    }
}

export function drawPlayer(ctx, sprite) {
    let position = Math.floor(actualFrame / frameDelay) % spriteAnimations[playerState].loc.length;
    let frameX = spriteAnimations[playerState].loc[position].x;
    let frameY = spriteAnimations[playerState].loc[position].y;
    ctx.drawImage(
        sprite,
        frameX, frameY,
        frameWidth, frameHeight,
        playerX, playerY,
        frameWidth, frameHeight
    );
    if (keys.up || keys.down || keys.left || keys.right) {
        actualFrame++;
    } else {
        actualFrame = 0;
    }
}

export function drawPlayerCollisionBox(ctx) {
    ctx.strokeStyle = 'red';
    ctx.strokeRect(playerX + 10, playerY + 9, frameWidth - 22, frameHeight - 10);
}

export function getPlayerCollisionBox() {
    return {
        x: playerX + 10,
        y: playerY + 9,
        w: frameWidth - 22,
        h: frameHeight - 10
    };
}

export function resetPlayer(canvas) {
    playerX = (canvas.width - frameWidth) / 2;
    playerY = (canvas.height - frameHeight) / 2;
    playerState = 'down';
    actualFrame = 0;
}
