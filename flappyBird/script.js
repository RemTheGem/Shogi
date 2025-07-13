const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bird = {
  x: 100,
  y: canvas.height / 2,
  radius: 20,
  velocity: 0,
  gravity: 1.5,
  jumpStrength: 4,
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 150;
const pipeDistance = 300;
const pipeColor = '#FF5733';

let isGameOver = false;
let score = 0;

function drawBird() {
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.closePath();
}

function drawPipes() {
  ctx.fillStyle = pipeColor;
  for (const pipe of pipes) {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
    ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
  }
}

function updateBird() {
  if (isGameOver) return;

  bird.velocity += bird.gravity * 0.1; // Apply gravity
  bird.y += bird.velocity;
  if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
    isGameOver = true;
  }
}

function createPipe() {
  const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
  const bottomY = topHeight + pipeGap;
  pipes.push({ x: canvas.width, topHeight, bottomY });
}

function updatePipes() {
  if (isGameOver) return;

  for (const pipe of pipes) {
    pipe.x -= 2;

    if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth) {
      if (bird.y - bird.radius < pipe.topHeight || bird.y + bird.radius > pipe.bottomY) {
        isGameOver = true;
      }
    }

    if (pipe.x + pipeWidth < 0) {
      pipes.shift();
      score++;
    }
  }

  if (pipes.length === 0 || canvas.width - pipes[pipes.length - 1].x >= pipeDistance) {
    createPipe();
  }
}

function drawScore() {
  ctx.font = '30px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText(`Score: ${score}`, 20, 40);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPipes();
  drawBird();
  drawScore();

  updateBird();
  updatePipes();

  if (!isGameOver) {
    requestAnimationFrame(draw);
  } else {
    ctx.font = '50px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
  }
}

function jump() {
  if (isGameOver) return;

  bird.velocity = -bird.jumpStrength;
}

document.addEventListener('keydown', function (event) {
  if (event.key === ' ' || event.key === 'ArrowUp') {
    jump();
  }
  if (event.key === ' ' && isGameOver) {
    isGameOver = false;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0; // Clear pipes
    score = 0; // Reset score
    createPipe(); // Create initial pipe
    draw(); // Restart the game loop
  }
});

document.addEventListener('click', jump);

createPipe();
draw();