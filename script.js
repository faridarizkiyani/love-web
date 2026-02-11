const canvas = document.getElementById("heart");
const ctx = canvas.getContext("2d");
const audio = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let particles = [];
let explosions = [];
const TOTAL = 600;

let textAlpha = 0;       
let pulse = 0;          

function heart(t) {
  let x = 16 * Math.pow(Math.sin(t), 3);
  let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
  return { x, y };
}

for (let i = 0; i < TOTAL; i++) {
  let t = Math.random() * Math.PI * 2;
  let p = heart(t);
  particles.push({
    t,
    x: p.x * 15 + canvas.width / 2,
    y: p.y * 15 + canvas.height / 2,
    speed: Math.random() * 0.01 + 0.003
  });
}

function createExplosion(x, y) {
  for (let i = 0; i < 70; i++) {
    explosions.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 7,
      vy: (Math.random() - 0.5) * 7,
      life: 60
    });
  }
}

canvas.addEventListener("click", e => {
  audio.play();
  createExplosion(e.clientX, e.clientY);
});

canvas.addEventListener("touchstart", e => {
  audio.play();
  const t = e.touches[0];
  createExplosion(t.clientX, t.clientY);
});

musicBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    musicBtn.textContent = "⏸ Pause Music";
  } else {
    audio.pause();
    musicBtn.textContent = "▶ Play Music";
  }
});

function drawCenterText(text) {
  if (textAlpha < 1) textAlpha += 0.01;

  pulse += 0.05;
  const scale = 1 + Math.sin(pulse) * 0.05;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(scale, scale);
  ctx.globalAlpha = textAlpha;

  ctx.font = "64px 'Great Vibes', cursive";
  ctx.fillStyle = "#ff77cc";
  ctx.shadowColor = "#ff00cc";
  ctx.shadowBlur = 30;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255, 0, 150, 0.9)";
  ctx.shadowColor = "rgba(255,0,180,1)";
  ctx.shadowBlur = 18;
  ctx.lineWidth = 1;

  particles.forEach(p => {
    p.t += p.speed;
    let pos = heart(p.t);
    let nx = pos.x * 15 + canvas.width / 2;
    let ny = pos.y * 15 + canvas.height / 2;

    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    p.x = nx;
    p.y = ny;
  });

  ctx.shadowBlur = 0;

  explosions.forEach((ex, i) => {
    ex.x += ex.vx;
    ex.y += ex.vy;
    ex.life--;

    ctx.fillStyle = "rgba(255,120,200,0.9)";
    ctx.beginPath();
    ctx.arc(ex.x, ex.y, 2, 0, Math.PI * 2);
    ctx.fill();

    if (ex.life <= 0) explosions.splice(i, 1);
  });

  drawCenterText("Darel");

  requestAnimationFrame(animate);
}

animate();


