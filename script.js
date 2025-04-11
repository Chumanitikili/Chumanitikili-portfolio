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
const renderer = new THREE.WebGLRenderer({ alpha: true });
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
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 2;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  particlesMesh.rotation.y += 0.001;
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

function drawGame() {
  // Clear canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = '#00b894';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });

  // Draw food
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

  // Draw score
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    generateFood();
  } else {
    snake.pop();
  }
}

function generateFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
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
  }

  moveSnake();
  drawGame();
  setTimeout(gameLoop, 100);
}

document.addEventListener('keydown', (e) => {
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