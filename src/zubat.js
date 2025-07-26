export const zubatFrameWidth = 60;
export const zubatFrameHeight = 60;
export const zubatTotalFrames = 9;
export const zubatFrameDelay = 8;

export let zubats = [];

let zubatCry;
export function setZubatCry(audio) {
    zubatCry = audio;
}

export function playZubatCry() {
    if (!zubatCry) return;
    const sfx = zubatCry.cloneNode();
    sfx.play();
}

export function getRandomCornerPosition(canvas, frameWidth) {
    const margin = frameWidth;
    const positions = [
        { x: margin, y: margin },
        { x: canvas.width - zubatFrameWidth - margin, y: margin },
        { x: margin, y: canvas.height - zubatFrameHeight - margin },
        { x: canvas.width - zubatFrameWidth - margin, y: canvas.height - zubatFrameHeight - margin }
    ];
    return positions[Math.floor(Math.random() * positions.length)];
}

export function createZubat(canvas, frameWidth) {
    const pos = getRandomCornerPosition(canvas, frameWidth);
    playZubatCry();
    return {
        x: pos.x,
        y: pos.y,
        vx: (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 2),
        vy: (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 2),
        frame: 0,
        frameCount: 0
    };
}

export function setInitialZubatPosition(canvas, frameWidth) {
    zubats = [createZubat(canvas, frameWidth)];
}

export function moveZubat(z, canvas, frameWidth) {
    z.x += z.vx;
    z.y += z.vy;

    const margin = frameWidth;

    if (z.x <= margin || z.x >= canvas.width - zubatFrameWidth - margin) {
        z.vx *= -1;
        z.x = Math.max(margin, Math.min(canvas.width - zubatFrameWidth - margin, z.x));
    }

    if (z.y <= margin || z.y >= canvas.height - zubatFrameHeight - margin) {
        z.vy *= -1;
        z.y = Math.max(margin, Math.min(canvas.height - zubatFrameHeight - margin, z.y));
    }

    if (Math.random() < 0.01) z.vx = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 2);
    if (Math.random() < 0.01) z.vy = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 2);
}

export function drawZubat(ctx, zubatImg, z) {
    if (++z.frameCount >= zubatFrameDelay) {
        z.frame = (z.frame + 1) % zubatTotalFrames;
        z.frameCount = 0;
    }
    ctx.drawImage(
        zubatImg,
        z.frame * zubatFrameWidth, 0,
        zubatFrameWidth, zubatFrameHeight,
        z.x, z.y,
        zubatFrameWidth, zubatFrameHeight
    );
}

export function drawZubatCollisionBox(ctx, z) {
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(z.x + 6, z.y + 6, zubatFrameWidth - 17, zubatFrameHeight - 17);
}

export function getZubatCollisionBox(z) {
    return {
        x: z.x + 6,
        y: z.y + 6,
        w: zubatFrameWidth - 17,
        h: zubatFrameHeight - 17
    };
}
