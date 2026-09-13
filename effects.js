const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const colors = ["#7dcfff", "#9f7fff", "#c0a3ff"];
const pixels = [];

for (let i = 0; i < 150; i++) {
  pixels.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.6,
    speedY: (Math.random() - 0.5) * 0.6,
    alpha: Math.random() * 0.6 + 0.3,
    color: colors[Math.floor(Math.random() * colors.length)]
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pixels.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.fillRect(p.x, p.y, p.size, p.size);

    p.x += p.speedX;
    p.y += p.speedY;

    // wrap around edges
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  });

  requestAnimationFrame(animate);
}

animate();
