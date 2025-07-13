const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const velocity = 0.5;
const character = {
    x: canvas.width / 2,
    y: 680,
    velocity: 10
};
const enemies = [];
const enemyWidth = 70;
const enemyHeight = 100; 
let enemyVelocity = 20;

let isGameOver = false;
let score = 0;

const rebecca = new Image();
rebecca.src = 'rebecca.webp';
const enemyImage = new Image();
enemyImage.src = 'adam smasher.png';
const background = new Image();
background.src = 'rebdeath.jpg';

function drawEnemy() {
    for (const enemy of enemies) {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemyWidth, enemyHeight);
    }
}
function spawnEnemy() {
    const x = Math.random() * (canvas.width - enemyWidth);
    enemies.push({ x: x, y: 0 }); // start at top (y=0)
}

// call spawnEnemy every 2 seconds
setInterval(spawnEnemy, 2000);
function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.y += enemyVelocity;

        if (character.x < enemy.x + enemyWidth &&
            character.x + 70 > enemy.x &&
            character.y < enemy.y + enemyHeight &&
            character.y + 120 > enemy.y) {
            isGameOver = true;
            return;
        }
        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);
            score++;
            enemyVelocity += 0.1; 
        }
    }
}    


function menubar() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2 - 20);
    ctx.fillText(`Score: ${score}`, canvas.width / 2 - 50, canvas.height / 2 + 20);
    ctx.fillText('Press R to Restart', canvas.width / 2 - 100, canvas.height / 2 + 60);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    if (isGameOver) {
        menubar();
        return; 
    }
    ctx.drawImage(rebecca, character.x, character.y, 70, 120);
    drawEnemy();
    updateEnemies();
    requestAnimationFrame(gameLoop);
}


rebecca.onload = () => {
    gameLoop();
};

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'a' && character.x > 0) {
        character.x -= character.velocity;
    } else if (event.key === 'ArrowRight' || event.key === 'd' && character.x < canvas.width - 60) {
        character.x += character.velocity;
    }
    else if (event.key === 'r' || event.key === 'R') {
        if (isGameOver) {
            isGameOver = false;
            enemies.length = 0; 
            score = 0; 
            enemyVelocity = 1; 
            character.x = canvas.width / 2;
            character.y = 680;
            gameLoop();
        }
    }
});
  
  
