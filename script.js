// Custom cursor
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// Tech Animation
const techAnimation = document.getElementById('tech-animation');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  alpha: true,
  antialias: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
techAnimation.appendChild(renderer.domElement);

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.005,
  color: 0xffffff,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 2;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  particlesMesh.rotation.y += 0.001;
  particlesMesh.rotation.x += 0.0005;
  renderer.render(scene, camera);
}
animate();

// Snake Game
const snakeGame = document.getElementById('snake-game');
const canvas = document.createElement('canvas');
canvas.width = snakeGame.clientWidth;
canvas.height = snakeGame.clientHeight;
snakeGame.appendChild(canvas);

const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
  { x: 10, y: 10 }
];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 100;
let gameStarted = false;

function drawGame() {
  // Clear canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = '#00b894';
  snake.forEach((segment, index) => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });

  // Draw food
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

  // Draw score
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);

  // Draw start message if game hasn't started
  if (!gameStarted) {
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press any arrow key to start', canvas.width / 2, canvas.height / 2);
    ctx.textAlign = 'left';
  }
}

function moveSnake() {
  if (!gameStarted) return;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    generateFood();
    // Increase game speed
    if (gameSpeed > 50) {
      gameSpeed -= 2;
    }
  } else {
    snake.pop();
  }
}

function generateFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
  
  // Make sure food doesn't spawn on snake
  while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
  }
}

function checkCollision() {
  const head = snake[0];
  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    return true;
  }
  return false;
}

function gameLoop() {
  if (checkCollision()) {
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 100;
    gameStarted = false;
  }

  moveSnake();
  drawGame();
  setTimeout(gameLoop, gameSpeed);
}

document.addEventListener('keydown', (e) => {
  if (!gameStarted && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    gameStarted = true;
  }

  switch (e.key) {
    case 'ArrowUp':
      if (dy !== 1) {
        dx = 0;
        dy = -1;
      }
      break;
    case 'ArrowDown':
      if (dy !== -1) {
        dx = 0;
        dy = 1;
      }
      break;
    case 'ArrowLeft':
      if (dx !== 1) {
        dx = -1;
        dy = 0;
      }
      break;
    case 'ArrowRight':
      if (dx !== -1) {
        dx = 1;
        dy = 0;
      }
      break;
  }
});

gameLoop();

// Responsive adjustments
window.addEventListener('resize', () => {
  // Update tech animation
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Update snake game
  canvas.width = snakeGame.clientWidth;
  canvas.height = snakeGame.clientHeight;
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
}); 