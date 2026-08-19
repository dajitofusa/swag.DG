// Self-contained, lightweight, fast-loading HTML5 web simulations.
// Designed to run flawlessly in sandboxed iframes with zero external dependencies,
// 0 network requests, and zero blocked asset domains.

export const SIMULATION_ENGINES: Record<string, string> = {
  'grid-2048': `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>2048</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
  body { background: #0f172a; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 12px; }
  .header { width: 100%; max-width: 380px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .title-group h1 { font-size: 28px; font-weight: 800; color: #60a5fa; line-height: 1; }
  .title-group p { font-size: 11px; color: #94a3b8; margin-top: 4px; }
  .scores { display: flex; gap: 8px; }
  .score-box { background: #1e293b; padding: 6px 12px; border-radius: 8px; text-align: center; min-width: 65px; border: 1px solid #334155; }
  .score-box .label { font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 700; }
  .score-box .val { font-size: 16px; font-weight: 800; color: #f8fafc; }
  .board { width: 100%; max-width: 380px; aspect-ratio: 1; background: #1e293b; border-radius: 12px; padding: 10px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; position: relative; border: 2px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
  .cell { background: #0f172a; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; transition: transform 0.12s ease, background-color 0.12s ease; }
  .cell[data-val="2"] { background: #334155; color: #e2e8f0; }
  .cell[data-val="4"] { background: #475569; color: #f8fafc; }
  .cell[data-val="8"] { background: #2563eb; color: #ffffff; }
  .cell[data-val="16"] { background: #1d4ed8; color: #ffffff; }
  .cell[data-val="32"] { background: #059669; color: #ffffff; }
  .cell[data-val="64"] { background: #047857; color: #ffffff; }
  .cell[data-val="128"] { background: #d97706; color: #ffffff; font-size: 20px; box-shadow: 0 0 10px rgba(217,119,6,0.5); }
  .cell[data-val="256"] { background: #b45309; color: #ffffff; font-size: 20px; box-shadow: 0 0 12px rgba(180,83,9,0.6); }
  .cell[data-val="512"] { background: #dc2626; color: #ffffff; font-size: 20px; box-shadow: 0 0 15px rgba(220,38,38,0.7); }
  .cell[data-val="1024"] { background: #7c3aed; color: #ffffff; font-size: 16px; box-shadow: 0 0 20px rgba(124,58,237,0.8); }
  .cell[data-val="2048"] { background: #ec4899; color: #ffffff; font-size: 16px; box-shadow: 0 0 25px rgba(236,72,153,0.9); }
  .controls-bar { width: 100%; max-width: 380px; display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
  .btn { background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; transition: 0.15s; }
  .btn:hover { background: #1d4ed8; }
  .overlay { position: absolute; inset: 0; background: rgba(15,23,42,0.92); border-radius: 12px; display: none; flex-direction: column; align-items: center; justify-content: center; backdrop-filter: blur(4px); z-index: 10; }
  .overlay.active { display: flex; }
  .overlay h2 { font-size: 24px; color: #f8fafc; margin-bottom: 12px; }
</style>
</head>
<body>
<div class="header">
  <div class="title-group">
    <h1>2048 Fusion</h1>
    <p>Join tiles to reach 2048</p>
  </div>
  <div class="scores">
    <div class="score-box"><div class="label">Score</div><div class="val" id="score">0</div></div>
    <div class="score-box"><div class="label">Best</div><div class="val" id="best">0</div></div>
  </div>
</div>
<div class="board" id="board">
  <div class="overlay" id="overlay">
    <h2 id="over-msg">Run Finished!</h2>
    <button class="btn" onclick="restart()">Try Again</button>
  </div>
</div>
<div class="controls-bar">
  <span style="font-size:11px;color:#64748b;">Use Arrow Keys or Swipe</span>
  <button class="btn" onclick="restart()">Restart</button>
</div>
<script>
let grid = Array(4).fill().map(() => Array(4).fill(0));
let score = 0;
let best = parseInt(localStorage.getItem('2048_best') || '0');
document.getElementById('best').innerText = best;

function init() {
  grid = Array(4).fill().map(() => Array(4).fill(0));
  score = 0;
  updateScore(0);
  spawnTile();
  spawnTile();
  draw();
  document.getElementById('overlay').classList.remove('active');
}

function spawnTile() {
  let empty = [];
  for (let r=0; r<4; r++) for (let c=0; c<4; c++) if (grid[r][c] === 0) empty.push({r, c});
  if (!empty.length) return;
  let spot = empty[Math.floor(Math.random() * empty.length)];
  grid[spot.r][spot.c] = Math.random() < 0.9 ? 2 : 4;
}

function draw() {
  const b = document.getElementById('board');
  const overlay = document.getElementById('overlay');
  b.innerHTML = '';
  b.appendChild(overlay);
  for (let r=0; r<4; r++) {
    for (let c=0; c<4; c++) {
      let cell = document.createElement('div');
      cell.className = 'cell';
      let v = grid[r][c];
      if (v > 0) {
        cell.innerText = v;
        cell.setAttribute('data-val', v);
      }
      b.appendChild(cell);
    }
  }
}

function updateScore(add) {
  score += add;
  document.getElementById('score').innerText = score;
  if (score > best) {
    best = score;
    localStorage.setItem('2048_best', best);
    document.getElementById('best').innerText = best;
  }
}

function slide(row) {
  let arr = row.filter(val => val);
  let missing = 4 - arr.length;
  let zeros = Array(missing).fill(0);
  return arr.concat(zeros);
}

function combine(row) {
  for (let i = 0; i < 3; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      updateScore(row[i]);
      row[i + 1] = 0;
    }
  }
  return row;
}

function moveRow(row) {
  return slide(combine(slide(row)));
}

function rotateLeft(mat) {
  let res = Array(4).fill().map(() => Array(4).fill(0));
  for (let r=0; r<4; r++) for (let c=0; c<4; c++) res[r][c] = mat[c][3-r];
  return res;
}

function move(dir) {
  let old = JSON.stringify(grid);
  if (dir === 'left') {
    for (let r=0; r<4; r++) grid[r] = moveRow(grid[r]);
  } else if (dir === 'right') {
    for (let r=0; r<4; r++) grid[r] = moveRow(grid[r].reverse()).reverse();
  } else if (dir === 'up') {
    grid = rotateLeft(rotateLeft(rotateLeft(grid)));
    for (let r=0; r<4; r++) grid[r] = moveRow(grid[r]);
    grid = rotateLeft(grid);
  } else if (dir === 'down') {
    grid = rotateLeft(grid);
    for (let r=0; r<4; r++) grid[r] = moveRow(grid[r]);
    grid = rotateLeft(rotateLeft(rotateLeft(grid)));
  }
  if (JSON.stringify(grid) !== old) {
    spawnTile();
    draw();
    checkGameOver();
  }
}

function checkGameOver() {
  for (let r=0; r<4; r++) for (let c=0; c<4; c++) if (grid[r][c] === 0) return;
  for (let r=0; r<4; r++) for (let c=0; c<3; c++) if (grid[r][c] === grid[r][c+1]) return;
  for (let c=0; c<4; c++) for (let r=0; r<3; r++) if (grid[r][c] === grid[r+1][c]) return;
  document.getElementById('overlay').classList.add('active');
}

window.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') move('left');
  else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') move('right');
  else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') move('up');
  else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') move('down');
});

// Touch swipe support
let touchStartX = 0, touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });
document.addEventListener('touchend', e => {
  let dx = e.changedTouches[0].clientX - touchStartX;
  let dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
    if (Math.abs(dx) > Math.abs(dy)) {
      move(dx > 0 ? 'right' : 'left');
    } else {
      move(dy > 0 ? 'down' : 'up');
    }
  }
}, { passive: true });

function restart() { init(); }
init();
</script>
</body>
</html>`,

  'retro-snake': `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Retro Serpent</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; font-family: 'Segoe UI', system-ui, sans-serif; }
  body { background: #090d16; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 12px; }
  .header { width: 100%; max-width: 400px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .score-badge { background: #1e293b; padding: 6px 14px; border-radius: 8px; font-weight: 700; border: 1px solid #334155; font-size: 14px; }
  .score-badge span { color: #10b981; }
  canvas { background: #111827; border: 2px solid #374151; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); max-width: 100%; aspect-ratio: 1; }
  .ctrls { margin-top: 14px; display: flex; gap: 8px; align-items: center; }
  .btn { background: #10b981; color: #022c22; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 800; cursor: pointer; font-size: 13px; }
  .btn:hover { background: #34d399; }
</style>
</head>
<body>
<div class="header">
  <h2 style="font-size:20px; font-weight:800; color:#34d399;">Retro Serpent</h2>
  <div style="display:flex;gap:8px;">
    <div class="score-badge">Score: <span id="score">0</span></div>
    <div class="score-badge">Best: <span id="best">0</span></div>
  </div>
</div>
<canvas id="c" width="400" height="400"></canvas>
<div class="ctrls">
  <span style="font-size:12px; color:#64748b;">Controls: Arrow Keys / WASD</span>
  <button class="btn" onclick="reset()">Restart</button>
</div>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const grid = 20;
const count = 20;
let snake = [{x: 10, y: 10}];
let dx = 1, dy = 0;
let food = {x: 15, y: 15};
let score = 0;
let best = parseInt(localStorage.getItem('snake_best') || '0');
document.getElementById('best').innerText = best;
let gameInterval;
let gameOver = false;

function spawnFood() {
  food = {
    x: Math.floor(Math.random() * count),
    y: Math.floor(Math.random() * count)
  };
  for (let part of snake) {
    if (part.x === food.x && part.y === food.y) return spawnFood();
  }
}

function update() {
  if (gameOver) return;
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  
  // Wrap around borders
  if (head.x < 0) head.x = count - 1;
  if (head.x >= count) head.x = 0;
  if (head.y < 0) head.y = count - 1;
  if (head.y >= count) head.y = 0;

  // Collision with self
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver = true;
      draw();
      return;
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    document.getElementById('score').innerText = score;
    if (score > best) {
      best = score;
      localStorage.setItem('snake_best', best);
      document.getElementById('best').innerText = best;
    }
    spawnFood();
  } else {
    snake.pop();
  }
  draw();
}

function draw() {
  ctx.fillStyle = '#0b1120';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid subtle lines
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 0.5;
  for (let i=0; i<count; i++) {
    ctx.beginPath();
    ctx.moveTo(i*grid, 0); ctx.lineTo(i*grid, 400);
    ctx.moveTo(0, i*grid); ctx.lineTo(400, i*grid);
    ctx.stroke();
  }

  // Food
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(food.x * grid + grid/2, food.y * grid + grid/2, grid/2.3, 0, Math.PI*2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Snake
  snake.forEach((part, idx) => {
    ctx.fillStyle = idx === 0 ? '#34d399' : '#059669';
    ctx.fillRect(part.x * grid + 1, part.y * grid + 1, grid - 2, grid - 2);
  });

  if (gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 22px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Session Finished', 200, 180);
    ctx.font = '14px system-ui';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Press SPACE or Restart to play again', 200, 215);
  }
}

window.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if ((k === 'arrowup' || k === 'w') && dy === 0) { dx = 0; dy = -1; }
  else if ((k === 'arrowdown' || k === 's') && dy === 0) { dx = 0; dy = 1; }
  else if ((k === 'arrowleft' || k === 'a') && dx === 0) { dx = -1; dy = 0; }
  else if ((k === 'arrowright' || k === 'd') && dx === 0) { dx = 1; dy = 0; }
  else if (e.code === 'Space' && gameOver) reset();
});

function reset() {
  snake = [{x: 10, y: 10}];
  dx = 1; dy = 0;
  score = 0;
  document.getElementById('score').innerText = score;
  gameOver = false;
  spawnFood();
}

reset();
setInterval(update, 100);
</script>
</body>
</html>`,

  'slope-run': `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Slope Velocity</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #030712; color: #fff; overflow: hidden; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
  canvas { border-radius: 12px; box-shadow: 0 0 40px rgba(56, 189, 248, 0.2); max-width: 100%; aspect-ratio: 16/9; }
  #ui { position: absolute; top: 16px; left: 24px; font-weight: 800; font-size: 20px; color: #38bdf8; text-shadow: 0 0 10px rgba(56,189,248,0.5); }
  #hud { position: absolute; bottom: 20px; font-size: 13px; color: #94a3b8; }
</style>
</head>
<body>
<div id="ui">Distance: <span id="dist">0</span>m | Speed: <span id="spd">1x</span></div>
<canvas id="c" width="800" height="450"></canvas>
<div id="hud">Use Left / Right Arrows or A/D to steer ball on the track</div>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let ballX = 0; // -1 to 1
let ballVx = 0;
let distance = 0;
let speed = 6;
let obstacles = [];
let roadSegments = [];
let keys = {};
let alive = true;

for (let i = 0; i < 20; i++) {
  roadSegments.push({ z: i * 50, curve: Math.sin(i * 0.3) * 40 });
}

window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function spawnObstacle() {
  if (Math.random() < 0.08) {
    obstacles.push({
      z: 1000,
      x: (Math.random() - 0.5) * 1.4,
      width: 0.35,
      type: Math.random() < 0.5 ? 'cube' : 'wall'
    });
  }
}

function update() {
  if (!alive) {
    if (keys[' '] || keys['enter'] || keys['r']) {
      ballX = 0; ballVx = 0; distance = 0; speed = 6; obstacles = []; alive = true;
    }
    return;
  }

  if (keys['arrowleft'] || keys['a']) ballVx -= 0.0035;
  if (keys['arrowright'] || keys['d']) ballVx += 0.0035;
  ballVx *= 0.88;
  ballX += ballVx;

  if (Math.abs(ballX) > 1.25) {
    alive = false; // Fell off track!
  }

  distance += speed * 0.1;
  speed = Math.min(18, 6 + distance * 0.005);
  document.getElementById('dist').innerText = Math.floor(distance);
  document.getElementById('spd').innerText = (speed/6).toFixed(1) + 'x';

  spawnObstacle();

  for (let o of obstacles) {
    o.z -= speed * 2;
    // Collision check
    if (o.z > 20 && o.z < 80 && Math.abs(ballX - o.x) < o.width) {
      alive = false;
    }
  }
  obstacles = obstacles.filter(o => o.z > 0);
}

function draw() {
  ctx.fillStyle = '#050814';
  ctx.fillRect(0, 0, 800, 450);

  // Horizon Neon Glow
  let grad = ctx.createLinearGradient(0, 0, 0, 450);
  grad.addColorStop(0, '#020617');
  grad.addColorStop(0.5, '#0f172a');
  grad.addColorStop(1, '#020617');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 450);

  // Horizon Line
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 200);
  ctx.lineTo(800, 200);
  ctx.stroke();

  // Perspective 3D Track
  let vpX = 400;
  let vpY = 200;

  for (let i = 0; i < 15; i++) {
    let z = (i * 60 - (distance * 10) % 60);
    if (z < 10) z += 900;
    let scale = 300 / (z + 100);
    let y = vpY + 220 * scale;
    let w = 450 * scale;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = Math.max(1, 4 * scale);
    ctx.strokeRect(vpX - w/2, y, w, 2);
  }

  // Draw Track Borders
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(vpX - 10, vpY);
  ctx.lineTo(100, 450);
  ctx.moveTo(vpX + 10, vpY);
  ctx.lineTo(700, 450);
  ctx.stroke();

  // Draw Obstacles
  for (let o of obstacles) {
    let scale = 300 / (o.z + 100);
    let ox = vpX + (o.x * 280 * scale);
    let oy = vpY + 200 * scale;
    let size = 60 * scale;

    ctx.fillStyle = '#f43f5e';
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 12;
    ctx.fillRect(ox - size/2, oy - size, size, size);
    ctx.strokeStyle = '#ffe4e6';
    ctx.strokeRect(ox - size/2, oy - size, size, size);
    ctx.shadowBlur = 0;
  }

  // Draw Ball
  let ballScreenX = vpX + (ballX * 240);
  let ballScreenY = 380;
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(ballScreenX, ballScreenY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Ball highlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(ballScreenX - 5, ballScreenY - 5, 5, 0, Math.PI*2);
  ctx.fill();

  if (!alive) {
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, 800, 450);
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 36px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('CRASHED / RUN FINISHED', 400, 200);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '18px system-ui';
    ctx.fillText('Distance: ' + Math.floor(distance) + 'm', 400, 240);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px system-ui';
    ctx.fillText('Press SPACE or R to Respawn', 400, 280);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
</script>
</body>
</html>`,

  'block-stacker': `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Block Grid Stacker</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; font-family: system-ui, sans-serif; }
  body { background: #0f172a; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 10px; }
  .game-container { display: flex; gap: 16px; align-items: flex-start; }
  canvas { background: #020617; border: 2px solid #334155; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); }
  .sidebar { display: flex; flex-direction: column; gap: 12px; width: 120px; }
  .box { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 8px; text-align: center; }
  .box .lbl { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; }
  .box .val { font-size: 18px; font-weight: 800; color: #60a5fa; margin-top: 2px; }
  .btn { background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 12px; }
  .btn:hover { background: #2563eb; }
</style>
</head>
<body>
<div style="margin-bottom:10px; font-weight:800; font-size:22px; color:#60a5fa;">Block Grid Stacker</div>
<div class="game-container">
  <canvas id="c" width="240" height="480"></canvas>
  <div class="sidebar">
    <div class="box"><div class="lbl">Score</div><div class="val" id="sc">0</div></div>
    <div class="box"><div class="lbl">Lines</div><div class="val" id="ln">0</div></div>
    <div class="box"><div class="lbl">Level</div><div class="val" id="lv">1</div></div>
    <button class="btn" onclick="reset()">Restart</button>
    <div style="font-size:10px; color:#64748b; margin-top:8px; line-height:1.4;">
      ← / → Move<br>↑ Rotate<br>↓ Soft Drop<br>Space Hard Drop
    </div>
  </div>
</div>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const COLS = 10, ROWS = 20, SIZE = 24;
let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let score = 0, lines = 0, level = 1;
let gameOver = false;

const SHAPES = [
  { c: '#06b6d4', m: [[1,1,1,1]] }, // I
  { c: '#eab308', m: [[1,1],[1,1]] }, // O
  { c: '#a855f7', m: [[0,1,0],[1,1,1]] }, // T
  { c: '#22c55e', m: [[0,1,1],[1,1,0]] }, // S
  { c: '#ef4444', m: [[1,1,0],[0,1,1]] }, // Z
  { c: '#3b82f6', m: [[1,0,0],[1,1,1]] }, // J
  { c: '#f97316', m: [[0,0,1],[1,1,1]] }  // L
];

let piece = null;
let dropCounter = 0, lastTime = 0;

function newPiece() {
  const t = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  piece = {
    color: t.c,
    matrix: t.m,
    x: Math.floor(COLS / 2) - Math.floor(t.m[0].length / 2),
    y: 0
  };
  if (collide()) {
    gameOver = true;
  }
}

function collide() {
  const m = piece.matrix;
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (m[y][x] !== 0) {
        let bx = piece.x + x;
        let by = piece.y + y;
        if (bx < 0 || bx >= COLS || by >= ROWS || (by >= 0 && board[by][bx])) {
          return true;
        }
      }
    }
  }
  return false;
}

function merge() {
  piece.matrix.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val !== 0) {
        board[piece.y + y][piece.x + x] = piece.color;
      }
    });
  });
}

function sweep() {
  let rowCount = 0;
  for (let y = ROWS - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== 0)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(0));
      rowCount++;
      y++;
    }
  }
  if (rowCount > 0) {
    lines += rowCount;
    score += [0, 100, 300, 500, 800][rowCount] * level;
    level = Math.floor(lines / 10) + 1;
    document.getElementById('sc').innerText = score;
    document.getElementById('ln').innerText = lines;
    document.getElementById('lv').innerText = level;
  }
}

function rotate(mat) {
  let N = mat.length;
  let M = mat[0].length;
  let res = Array(M).fill().map(() => Array(N).fill(0));
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < M; x++) {
      res[x][N - 1 - y] = mat[y][x];
    }
  }
  return res;
}

function drop() {
  piece.y++;
  if (collide()) {
    piece.y--;
    merge();
    sweep();
    newPiece();
  }
  dropCounter = 0;
}

function hardDrop() {
  while (!collide()) {
    piece.y++;
  }
  piece.y--;
  merge();
  sweep();
  newPiece();
  dropCounter = 0;
}

function draw() {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw board
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (board[y][x]) {
        ctx.fillStyle = board[y][x];
        ctx.fillRect(x * SIZE, y * SIZE, SIZE - 1, SIZE - 1);
      } else {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x * SIZE, y * SIZE, SIZE, SIZE);
      }
    }
  }

  // Draw active piece
  if (piece) {
    ctx.fillStyle = piece.color;
    piece.matrix.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val !== 0) {
          ctx.fillRect((piece.x + x) * SIZE, (piece.y + y) * SIZE, SIZE - 1, SIZE - 1);
        }
      });
    });
  }

  if (gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Round Over', 120, 220);
  }
}

function update(time = 0) {
  const dt = time - lastTime;
  lastTime = time;
  dropCounter += dt;
  const dropInterval = Math.max(100, 1000 - (level - 1) * 100);

  if (!gameOver) {
    if (dropCounter > dropInterval) {
      drop();
    }
  }

  draw();
  requestAnimationFrame(update);
}

window.addEventListener('keydown', e => {
  if (gameOver) return;
  if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
    piece.x--;
    if (collide()) piece.x++;
  } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
    piece.x++;
    if (collide()) piece.x--;
  } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
    drop();
  } else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
    const old = piece.matrix;
    piece.matrix = rotate(piece.matrix);
    if (collide()) piece.matrix = old;
  } else if (e.code === 'Space') {
    hardDrop();
  }
});

function reset() {
  board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
  score = 0; lines = 0; level = 1;
  document.getElementById('sc').innerText = 0;
  document.getElementById('ln').innerText = 0;
  document.getElementById('lv').innerText = 1;
  gameOver = false;
  newPiece();
}

reset();
update();
</script>
</body>
</html>`,

  'pixel-flapper': `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Flappy Flight</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #0f172a; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui, sans-serif; }
  canvas { border-radius: 12px; border: 2px solid #38bdf8; box-shadow: 0 10px 30px rgba(0,0,0,0.5); cursor: pointer; max-width: 100%; aspect-ratio: 9/16; max-height: 80vh; }
  .tip { margin-top: 10px; font-size: 13px; color: #94a3b8; }
</style>
</head>
<body>
<canvas id="c" width="360" height="540"></canvas>
<div class="tip">Click, Tap, or Press SPACE to flap wings</div>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

let bird = { x: 60, y: 250, v: 0, g: 0.38, jump: -6.5, r: 14 };
let pipes = [];
let frame = 0;
let score = 0;
let best = parseInt(localStorage.getItem('flappy_best') || '0');
let state = 'start'; // start, play, over

function reset() {
  bird.y = 250;
  bird.v = 0;
  pipes = [];
  score = 0;
  state = 'play';
}

function flap() {
  if (state === 'start' || state === 'over') {
    reset();
  } else if (state === 'play') {
    bird.v = bird.jump;
  }
}

window.addEventListener('keydown', e => { if (e.code === 'Space' || e.key === 'ArrowUp') flap(); });
canvas.addEventListener('pointerdown', flap);

function loop() {
  frame++;
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, 360, 540);

  // Background clouds
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath();
  ctx.arc(80 + (frame * 0.2) % 400, 100, 35, 0, Math.PI*2);
  ctx.arc(110 + (frame * 0.2) % 400, 95, 45, 0, Math.PI*2);
  ctx.arc(260 + (frame * 0.15) % 400, 160, 40, 0, Math.PI*2);
  ctx.fill();

  // Ground
  ctx.fillStyle = '#15803d';
  ctx.fillRect(0, 480, 360, 60);
  ctx.fillStyle = '#166534';
  ctx.fillRect(0, 480, 360, 8);

  if (state === 'play') {
    bird.v += bird.g;
    bird.y += bird.v;

    if (bird.y + bird.r >= 480 || bird.y - bird.r <= 0) {
      state = 'over';
      if (score > best) { best = score; localStorage.setItem('flappy_best', best); }
    }

    // Spawn pipes
    if (frame % 90 === 0) {
      let gap = 120;
      let topHeight = Math.floor(Math.random() * 200) + 60;
      pipes.push({ x: 360, top: topHeight, bottom: topHeight + gap, passed: false });
    }

    for (let i = 0; i < pipes.length; i++) {
      let p = pipes[i];
      p.x -= 2.2;

      // Check collision
      if (bird.x + bird.r > p.x && bird.x - bird.r < p.x + 50) {
        if (bird.y - bird.r < p.top || bird.y + bird.r > p.bottom) {
          state = 'over';
          if (score > best) { best = score; localStorage.setItem('flappy_best', best); }
        }
      }

      // Check score
      if (!p.passed && p.x + 50 < bird.x) {
        p.passed = true;
        score++;
      }
    }
    pipes = pipes.filter(p => p.x > -60);
  }

  // Draw pipes
  pipes.forEach(p => {
    ctx.fillStyle = '#22c55e';
    // top pipe
    ctx.fillRect(p.x, 0, 50, p.top);
    ctx.fillStyle = '#15803d';
    ctx.fillRect(p.x - 2, p.top - 16, 54, 16);

    // bottom pipe
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(p.x, p.bottom, 50, 480 - p.bottom);
    ctx.fillStyle = '#15803d';
    ctx.fillRect(p.x - 2, p.bottom, 54, 16);
  });

  // Draw Bird
  ctx.save();
  ctx.translate(bird.x, bird.y);
  let rot = Math.min(Math.PI/3, Math.max(-Math.PI/4, bird.v * 0.08));
  ctx.rotate(rot);
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(0, 0, bird.r, 0, Math.PI*2);
  ctx.fill();
  // Beak
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.moveTo(8, -4); ctx.lineTo(18, 0); ctx.lineTo(8, 4);
  ctx.fill();
  // Eye
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(4, -5, 4, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(5, -5, 2, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();

  // Score HUD
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(score, 180, 60);

  if (state === 'start') {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, 360, 540);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 24px system-ui';
    ctx.fillText('Flappy Flight', 180, 230);
    ctx.font = '15px system-ui';
    ctx.fillStyle = '#bae6fd';
    ctx.fillText('Click or Tap to Launch', 180, 270);
  } else if (state === 'over') {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, 360, 540);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 26px system-ui';
    ctx.fillText('Session Finished', 180, 220);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '18px system-ui';
    ctx.fillText('Score: ' + score + ' | Best: ' + best, 180, 260);
    ctx.font = '14px system-ui';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Tap to Fly Again', 180, 300);
  }

  requestAnimationFrame(loop);
}
loop();
</script>
</body>
</html>`,

  'breakout-ball': `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Brick Breaker</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; font-family: system-ui; }
  body { background: #0b0f19; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
  canvas { background: #020617; border: 2px solid #334155; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
  .hud { width: 480px; display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 700; font-size: 14px; color: #38bdf8; }
</style>
</head>
<body>
<div class="hud">
  <div>Score: <span id="s">0</span></div>
  <div>Lives: <span id="l">3</span></div>
</div>
<canvas id="c" width="480" height="420"></canvas>
<div style="margin-top:10px; font-size:12px; color:#64748b;">Move mouse or use Left / Right arrows to steer paddle</div>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let paddle = { w: 85, h: 12, x: 200, y: 395, speed: 7 };
let ball = { x: 240, y: 300, dx: 3.5, dy: -3.5, r: 6 };
let bricks = [];
let score = 0, lives = 3;
let keys = {};

const rows = 5, cols = 8;
const brickW = 52, brickH = 16, pad = 6, offTop = 40, offLeft = 10;
const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

function initBricks() {
  bricks = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      bricks.push({
        x: c * (brickW + pad) + offLeft,
        y: r * (brickH + pad) + offTop,
        color: colors[r],
        active: true
      });
    }
  }
}

window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  paddle.x = e.clientX - rect.left - paddle.w / 2;
});

function update() {
  if (keys['arrowleft'] || keys['a']) paddle.x -= paddle.speed;
  if (keys['arrowright'] || keys['d']) paddle.x += paddle.speed;
  paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, paddle.x));

  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collisions
  if (ball.x - ball.r <= 0 || ball.x + ball.r >= canvas.width) ball.dx = -ball.dx;
  if (ball.y - ball.r <= 0) ball.dy = -ball.dy;

  // Paddle collision
  if (ball.y + ball.r >= paddle.y && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w && ball.dy > 0) {
    ball.dy = -Math.abs(ball.dy);
    let hitOffset = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
    ball.dx = hitOffset * 4.5;
  }

  // Brick collisions
  bricks.forEach(b => {
    if (b.active && ball.x > b.x && ball.x < b.x + brickW && ball.y > b.y && ball.y < b.y + brickH) {
      b.active = false;
      ball.dy = -ball.dy;
      score += 15;
      document.getElementById('s').innerText = score;
    }
  });

  // Bottom death
  if (ball.y > canvas.height) {
    lives--;
    document.getElementById('l').innerText = lives;
    if (lives <= 0) {
      lives = 3; score = 0; initBricks();
      document.getElementById('l').innerText = lives;
      document.getElementById('s').innerText = score;
    }
    ball.x = 240; ball.y = 300; ball.dy = -3.5; ball.dx = 3;
  }
}

function draw() {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bricks
  bricks.forEach(b => {
    if (b.active) {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, brickW, brickH);
    }
  });

  // Paddle
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

  // Ball
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

initBricks();
loop();
</script>
</body>
</html>`,

  'pong-rally': `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vector Pong</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui; }
  body { background: #020617; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
  canvas { border: 2px solid #334155; border-radius: 8px; box-shadow: 0 0 30px rgba(59,130,246,0.2); }
  .score { font-size: 28px; font-weight: 800; color: #60a5fa; margin-bottom: 8px; display: flex; gap: 40px; }
</style>
</head>
<body>
<div class="score">
  <span>Player: <span id="p1">0</span></span>
  <span>CPU: <span id="p2">0</span></span>
</div>
<canvas id="c" width="600" height="380"></canvas>
<div style="margin-top:10px; font-size:12px; color:#64748b;">Move mouse or W/S to move paddle</div>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let p1Y = 150, p2Y = 150;
let ball = { x: 300, y: 190, dx: 4.5, dy: 2.5, r: 6 };
let s1 = 0, s2 = 0;
let keys = {};

canvas.addEventListener('mousemove', e => {
  const r = canvas.getBoundingClientRect();
  p1Y = e.clientY - r.top - 40;
});
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function loop() {
  if (keys['w'] || keys['arrowup']) p1Y -= 6;
  if (keys['s'] || keys['arrowdown']) p1Y += 6;
  p1Y = Math.max(0, Math.min(300, p1Y));

  // AI Paddle
  let targetY = ball.y - 40;
  p2Y += (targetY - p2Y) * 0.085;
  p2Y = Math.max(0, Math.min(300, p2Y));

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y <= 0 || ball.y >= 380) ball.dy = -ball.dy;

  // P1 Collision
  if (ball.x - ball.r <= 25 && ball.y >= p1Y && ball.y <= p1Y + 80) {
    ball.dx = Math.abs(ball.dx) * 1.05;
    ball.dy += (ball.y - (p1Y + 40)) * 0.1;
  }
  // P2 Collision
  if (ball.x + ball.r >= 575 && ball.y >= p2Y && ball.y <= p2Y + 80) {
    ball.dx = -Math.abs(ball.dx) * 1.05;
    ball.dy += (ball.y - (p2Y + 40)) * 0.1;
  }

  // Scoring
  if (ball.x < 0) {
    s2++; document.getElementById('p2').innerText = s2;
    ball = { x: 300, y: 190, dx: 4.5, dy: (Math.random()-0.5)*4, r: 6 };
  }
  if (ball.x > 600) {
    s1++; document.getElementById('p1').innerText = s1;
    ball = { x: 300, y: 190, dx: -4.5, dy: (Math.random()-0.5)*4, r: 6 };
  }

  // Draw
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, 600, 380);

  // Center net
  ctx.strokeStyle = '#1e293b';
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(300, 0); ctx.lineTo(300, 380);
  ctx.stroke();
  ctx.setLineDash([]);

  // Paddles
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(15, p1Y, 10, 80);
  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(575, p2Y, 10, 80);

  // Ball
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
  ctx.fill();

  requestAnimationFrame(loop);
}
loop();
</script>
</body>
</html>`,

  'mine-sweeper': `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Grid Sweeper</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; font-family: system-ui, sans-serif; }
  body { background: #0f172a; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 12px; }
  .board { display: grid; gap: 2px; background: #334155; padding: 6px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
  .cell { width: 32px; height: 32px; background: #1e293b; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 15px; cursor: pointer; border-radius: 3px; }
  .cell:hover { background: #334155; }
  .cell.revealed { background: #020617; }
  .cell.flagged { color: #f59e0b; }
  .cell.mine { background: #ef4444; color: white; }
  .header { display: flex; justify-content: space-between; width: 290px; margin-bottom: 10px; align-items: center; }
  .btn { background: #3b82f6; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: 700; cursor: pointer; }
</style>
</head>
<body>
<div class="header">
  <div>Mines: <span id="mines">10</span></div>
  <button class="btn" onclick="init()">Restart</button>
</div>
<div class="board" id="b" style="grid-template-columns: repeat(9, 32px);"></div>
<div style="margin-top:10px; font-size:12px; color:#64748b;">Left click: Reveal | Right click: Flag</div>
<script>
const ROWS = 9, COLS = 9, MINES = 10;
let grid = [], revealed = [], flagged = [];
let gameOver = false;

function init() {
  grid = Array(ROWS).fill().map(() => Array(COLS).fill(0));
  revealed = Array(ROWS).fill().map(() => Array(COLS).fill(false));
  flagged = Array(ROWS).fill().map(() => Array(COLS).fill(false));
  gameOver = false;
  document.getElementById('mines').innerText = MINES;

  // Plant mines
  let planted = 0;
  while (planted < MINES) {
    let r = Math.floor(Math.random() * ROWS);
    let c = Math.floor(Math.random() * COLS);
    if (grid[r][c] !== 'M') {
      grid[r][c] = 'M';
      planted++;
    }
  }

  // Compute numbers
  for (let r=0; r<ROWS; r++) {
    for (let c=0; c<COLS; c++) {
      if (grid[r][c] === 'M') continue;
      let count = 0;
      for (let dr=-1; dr<=1; dr++) {
        for (let dc=-1; dc<=1; dc++) {
          let nr = r + dr, nc = c + dc;
          if (nr>=0 && nr<ROWS && nc>=0 && nc<COLS && grid[nr][nc] === 'M') count++;
        }
      }
      grid[r][c] = count;
    }
  }
  render();
}

function reveal(r, c) {
  if (gameOver || revealed[r][c] || flagged[r][c]) return;
  revealed[r][c] = true;
  if (grid[r][c] === 'M') {
    gameOver = true;
    revealAll();
    return;
  }
  if (grid[r][c] === 0) {
    for (let dr=-1; dr<=1; dr++) {
      for (let dc=-1; dc<=1; dc++) {
        let nr = r + dr, nc = c + dc;
        if (nr>=0 && nr<ROWS && nc>=0 && nc<COLS && !revealed[nr][nc]) reveal(nr, nc);
      }
    }
  }
  render();
}

function toggleFlag(r, c, e) {
  e.preventDefault();
  if (gameOver || revealed[r][c]) return;
  flagged[r][c] = !flagged[r][c];
  let flagCount = flagged.flat().filter(Boolean).length;
  document.getElementById('mines').innerText = MINES - flagCount;
  render();
}

function revealAll() {
  revealed = revealed.map(row => row.map(() => true));
  render();
}

const colors = ['', '#38bdf8', '#4ade80', '#f87171', '#818cf8', '#fb923c', '#2dd4bf', '#e879f9', '#94a3b8'];

function render() {
  const b = document.getElementById('b');
  b.innerHTML = '';
  for (let r=0; r<ROWS; r++) {
    for (let c=0; c<COLS; c++) {
      let div = document.createElement('div');
      div.className = 'cell';
      if (revealed[r][c]) {
        div.classList.add('revealed');
        if (grid[r][c] === 'M') {
          div.classList.add('mine');
          div.innerText = '💣';
        } else if (grid[r][c] > 0) {
          div.innerText = grid[r][c];
          div.style.color = colors[grid[r][c]];
        }
      } else if (flagged[r][c]) {
        div.classList.add('flagged');
        div.innerText = '🚩';
      }
      div.onclick = () => reveal(r, c);
      div.oncontextmenu = (e) => toggleFlag(r, c, e);
      b.appendChild(div);
    }
  }
}
init();
</script>
</body>
</html>`,

  'click-cookie': `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Factory Simulation</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; font-family: system-ui, sans-serif; }
  body { background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 12px; }
  .wrapper { display: flex; gap: 20px; width: 100%; max-width: 600px; }
  .left { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #1e293b; border-radius: 12px; padding: 20px; border: 1px solid #334155; }
  .right { width: 240px; display: flex; flex-direction: column; gap: 8px; }
  .cookie-btn { width: 130px; height: 130px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #d97706, #78350f); border: 4px solid #b45309; cursor: pointer; transition: transform 0.08s; box-shadow: 0 10px 20px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 40px; }
  .cookie-btn:active { transform: scale(0.92); }
  .item-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
  .item-card:hover { border-color: #3b82f6; }
  .item-card.disabled { opacity: 0.5; pointer-events: none; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="left">
    <div style="font-size: 28px; font-weight: 800; color: #fbbf24;" id="count">0</div>
    <div style="font-size: 12px; color: #94a3b8; margin-bottom: 20px;">per second: <span id="cps">0</span></div>
    <button class="cookie-btn" onclick="clickCookie()">🍪</button>
  </div>
  <div class="right">
    <div style="font-weight: 700; color: #38bdf8; margin-bottom: 4px;">Upgrades</div>
    <div class="item-card" onclick="buy('cursor')" id="u-cursor">
      <div><div>Auto Clicker</div><div style="font-size:11px;color:#94a3b8;">+0.5/s</div></div>
      <div style="font-weight:800; color:#fbbf24;" id="c-cursor">15</div>
    </div>
    <div class="item-card" onclick="buy('grandma')" id="u-grandma">
      <div><div>Baker Helper</div><div style="font-size:11px;color:#94a3b8;">+4/s</div></div>
      <div style="font-weight:800; color:#fbbf24;" id="c-grandma">100</div>
    </div>
    <div class="item-card" onclick="buy('factory')" id="u-factory">
      <div><div>Nano Factory</div><div style="font-size:11px;color:#94a3b8;">+32/s</div></div>
      <div style="font-weight:800; color:#fbbf24;" id="c-factory">1100</div>
    </div>
    <div class="item-card" onclick="buy('mine')" id="u-mine">
      <div><div>Quantum Mine</div><div style="font-size:11px;color:#94a3b8;">+260/s</div></div>
      <div style="font-weight:800; color:#fbbf24;" id="c-mine">12000</div>
    </div>
  </div>
</div>
<script>
let cookies = 0;
let items = {
  cursor: { cost: 15, cps: 0.5, count: 0 },
  grandma: { cost: 100, cps: 4, count: 0 },
  factory: { cost: 1100, cps: 32, count: 0 },
  mine: { cost: 12000, cps: 260, count: 0 },
};

function clickCookie() {
  cookies += 1;
  updateUI();
}

function buy(k) {
  if (cookies >= items[k].cost) {
    cookies -= items[k].cost;
    items[k].count++;
    items[k].cost = Math.floor(items[k].cost * 1.15);
    updateUI();
  }
}

function getCPS() {
  let sum = 0;
  for (let k in items) sum += items[k].count * items[k].cps;
  return sum;
}

function updateUI() {
  document.getElementById('count').innerText = Math.floor(cookies).toLocaleString();
  document.getElementById('cps').innerText = getCPS().toFixed(1);
  for (let k in items) {
    document.getElementById('c-' + k).innerText = items[k].cost.toLocaleString();
    let card = document.getElementById('u-' + k);
    if (cookies < items[k].cost) card.classList.add('disabled');
    else card.classList.remove('disabled');
  }
}

setInterval(() => {
  cookies += getCPS() / 10;
  updateUI();
}, 100);
updateUI();
</script>
</body>
</html>`,

  'speed-typer': `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Speed Typing Benchmark</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'JetBrains Mono', monospace, system-ui; }
  body { background: #090d16; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
  .box { width: 100%; max-width: 650px; background: #111827; border: 1px solid #374151; border-radius: 12px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
  .stats { display: flex; justify-content: space-around; margin-bottom: 20px; }
  .stat-val { font-size: 26px; font-weight: 800; color: #38bdf8; text-align: center; }
  .stat-lbl { font-size: 11px; text-transform: uppercase; color: #94a3b8; }
  .prompt { font-size: 18px; line-height: 1.6; color: #64748b; margin-bottom: 20px; word-break: break-word; }
  .prompt span.correct { color: #4ade80; }
  .prompt span.incorrect { color: #f87171; background: rgba(239,68,68,0.2); border-radius: 2px; }
  .prompt span.current { text-decoration: underline; color: #f8fafc; }
  textarea { width: 100%; height: 80px; background: #1e293b; border: 1px solid #475569; border-radius: 8px; color: #fff; padding: 12px; font-size: 16px; outline: none; resize: none; }
  .btn { margin-top: 14px; background: #2563eb; color: white; border: none; padding: 8px 18px; border-radius: 6px; font-weight: 700; cursor: pointer; }
</style>
</head>
<body>
<div class="box">
  <div class="stats">
    <div><div class="stat-val" id="wpm">0</div><div class="stat-lbl">WPM</div></div>
    <div><div class="stat-val" id="acc">100%</div><div class="stat-lbl">Accuracy</div></div>
    <div><div class="stat-val" id="time">0s</div><div class="stat-lbl">Time</div></div>
  </div>
  <div class="prompt" id="promptText"></div>
  <textarea id="input" placeholder="Start typing the text above..." autofocus></textarea>
  <button class="btn" onclick="init()">Next Passage</button>
</div>
<script>
const passages = [
  "The pursuit of knowledge is a continuous journey of discovery and learning across various disciplines of science and literature.",
  "Modern algorithms optimize resource allocation and solve complex computational challenges with high mathematical precision.",
  "Continuous focus and deliberate practice cultivate deep mastery over intricate programming systems and architectural patterns."
];

let target = "", startTime = null, timer = null;

function init() {
  target = passages[Math.floor(Math.random() * passages.length)];
  startTime = null;
  clearInterval(timer);
  document.getElementById('input').value = '';
  document.getElementById('wpm').innerText = '0';
  document.getElementById('acc').innerText = '100%';
  document.getElementById('time').innerText = '0s';
  render();
}

function render() {
  const val = document.getElementById('input').value;
  let html = '';
  for (let i = 0; i < target.length; i++) {
    if (i < val.length) {
      if (val[i] === target[i]) html += '<span class="correct">' + target[i] + '</span>';
      else html += '<span class="incorrect">' + target[i] + '</span>';
    } else if (i === val.length) {
      html += '<span class="current">' + target[i] + '</span>';
    } else {
      html += '<span>' + target[i] + '</span>';
    }
  }
  document.getElementById('promptText').innerHTML = html;
}

document.getElementById('input').addEventListener('input', e => {
  if (!startTime) {
    startTime = Date.now();
    timer = setInterval(() => {
      let sec = Math.floor((Date.now() - startTime) / 1000);
      document.getElementById('time').innerText = sec + 's';
      let words = document.getElementById('input').value.length / 5;
      let wpm = Math.floor((words / Math.max(1, sec)) * 60);
      document.getElementById('wpm').innerText = wpm;
    }, 500);
  }
  render();
  if (e.target.value === target) {
    clearInterval(timer);
  }
});

init();
</script>
</body>
</html>`,

  'reaction-test': `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reaction Benchmark</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; font-family: system-ui; }
  body { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; cursor: pointer; transition: background 0.15s; background: #1e293b; color: white; }
  h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; text-align: center; }
  p { font-size: 16px; opacity: 0.8; }
</style>
</head>
<body id="b" onclick="handleClick()">
  <h1 id="title">Reaction Speed Benchmark</h1>
  <p id="sub">Click anywhere to begin</p>
<script>
let state = 'idle'; // idle, waiting, ready, result
let startTime = 0, timeout = null;

function handleClick() {
  const b = document.getElementById('b');
  const title = document.getElementById('title');
  const sub = document.getElementById('sub');

  if (state === 'idle' || state === 'result') {
    state = 'waiting';
    b.style.background = '#dc2626';
    title.innerText = 'Wait for GREEN...';
    sub.innerText = 'Do not click yet';
    let delay = Math.random() * 3000 + 1500;
    timeout = setTimeout(() => {
      state = 'ready';
      startTime = Date.now();
      b.style.background = '#16a34a';
      title.innerText = 'CLICK NOW!';
      sub.innerText = 'Fast as you can!';
    }, delay);
  } else if (state === 'waiting') {
    clearTimeout(timeout);
    state = 'idle';
    b.style.background = '#1e293b';
    title.innerText = 'Too Soon!';
    sub.innerText = 'Click to try again';
  } else if (state === 'ready') {
    let diff = Date.now() - startTime;
    state = 'result';
    b.style.background = '#2563eb';
    title.innerText = diff + ' ms';
    sub.innerText = 'Click anywhere to test again';
  }
}
</script>
</body>
</html>`
};
