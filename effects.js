const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const pixels = [];
const colors = ["#7dcfff", "#9f7fff", "#c0a3ff"]; // Tokyo Night cyan, violet, lavender

for (let i = 0; i < 100; i++) {
    pixels.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.3 + 0.1,
        speedX: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.6 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)]
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pixels.forEach(p => {
        ctx.fillStyle = `${p.color}${Math.floor(p.alpha * 255).toString(16)}`;
        ctx.fillRect(p.x, p.y, p.size, p.size);

        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
        }
    });

    requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
