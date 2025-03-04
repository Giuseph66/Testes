// ========= Sistema de Seed =========
// Defina uma seed padrão ou use uma que venha do localStorage// Recupera a seed do localStorage (convertendo para número, se necessário)
let seed = parseInt(localStorage.getItem('seed'));
// Função seededRandom() usando LCG
function seededRandom() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

// ========= Configuração do Canvas =========
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ========= Variáveis Globais =========
let coins = JSON.parse(localStorage.getItem('coins')) || 0;
let runes = JSON.parse(localStorage.getItem('runes')) || 0;
let gameOver = false;
let activePowers = {
  escudo: 0,
  impulso: 0,
  velocidade: 0,
  invisibilidade: 0,
  magnetismo: 0,
  teletransporte: 0,
  cloneSombrio: 0,
  controleDoTempo: 0,
  mundoInvertido: 0,
  voar: 0,
  raioLaser: 0,
  escalada: 0,
  espectro: 0,
  espadaSagrada: 0,
  bumerangue: 0,
  formaAquatica: 0,
  congelamento: 0,
  furia: 0,
  mina: 0,
  laminaGiratoria: 0,
  curaGradual: 0,
  armadilhaEspinhos: 0,
  gancho: 0,
  eloEspiritual: 0,
  superSopro: 0
};
let scrollOffset = 0;
let currentRoom = 0;
const ROOM_WIDTH = canvas.width;
let frameCount = 0;

// ========= Estrutura das Salas =========
const rooms = {};

// ========= Configuração do Jogador =========
const player = {
  x: 50, // Always start the game from the beginning
  y: 300,
  width: 30, 
  height: 30,
  velocityX: 0, 
  velocityY: 0,
  speed: 3,
  jumpForce: -10,
  color: 'red',
  maxAirJumps: JSON.parse(localStorage.getItem('extraJumps')) || 1,
  remainingAirJumps: JSON.parse(localStorage.getItem('extraJumps')) || 1
};

// ========= Física e Teclado =========
const GRAVITY = 0.3;
const keys = {};

// ========= Função para Gerar Salas =========
function generateRoom(roomIndex) {
  const roomStartX = roomIndex * ROOM_WIDTH;
  const room = {
    platforms: [],
    coins: [],
    runes: [],
    powerUps: [],
    spikes: [],
    enemies: []
  };

  // Plataforma do chão
  room.platforms.push({ x: roomStartX, y: 550, width: ROOM_WIDTH, height: 50 });

  // Plataformas extras (2 a 4)
  const numPlatforms = 2 + Math.floor(seededRandom() * 3);
  for (let i = 0; i < numPlatforms; i++) {
    const platWidth = 80 + seededRandom() * 70;
    const platX = roomStartX + seededRandom() * (ROOM_WIDTH - platWidth);
    const platY = 300 + seededRandom() * 200;
    room.platforms.push({ x: platX, y: platY, width: platWidth, height: 20 });
  }

  // Moedas (1 a 3)
  const numCoins = 1 + Math.floor(seededRandom() * 3);
  for (let i = 0; i < numCoins; i++) {
    const coinX = roomStartX + 50 + seededRandom() * (ROOM_WIDTH - 100);
    const coinY = 250 + seededRandom() * 200;
    room.coins.push({ x: coinX, y: coinY, width: 15, height: 15, collected: false });
  }

  // Runas (0 a 2)
  const numRunes = Math.floor(seededRandom() * 3);
  for (let i = 0; i < numRunes; i++) {
    const runeX = roomStartX + 50 + seededRandom() * (ROOM_WIDTH - 100);
    const runeY = 200 + seededRandom() * 150;
    room.runes.push({ x: runeX, y: runeY, width: 20, height: 20, collected: false });
  }

  // Power-ups (0 a 2)
  const numPowerUps = Math.floor(seededRandom() * 3);
  const powerTypes = ['escudo', 'impulso', 'velocidade', 'invisibilidade', 'magnetismo'];
  for (let i = 0; i < numPowerUps; i++) {
    const pType = powerTypes[Math.floor(seededRandom() * powerTypes.length)];
    const pX = roomStartX + 50 + seededRandom() * (ROOM_WIDTH - 100);
    const pY = 220 + seededRandom() * 200;
    room.powerUps.push({ type: pType, x: pX, y: pY, width: 20, height: 20, collected: false });
  }

  // Espinhos (1 a 3)
  const numSpikes = 1 + Math.floor(seededRandom() * 3);
  for (let i = 0; i < numSpikes; i++) {
    const spikeX = roomStartX + 50 + seededRandom() * (ROOM_WIDTH - 100);
    room.spikes.push({ x: spikeX, y: 530, width: 30, height: 20 });
  }

  // Inimigos (2 a 4)
  const numEnemies = 2 + Math.floor(seededRandom() * 3);
  const enemyTypes = ["normal", "fast", "big"];
  for (let i = 0; i < numEnemies; i++) {
    const enemyType = enemyTypes[Math.floor(seededRandom() * enemyTypes.length)];
    let enemyWidth, enemyHeight, velocityX;
    if (enemyType === "normal") {
      enemyWidth = 30; enemyHeight = 30; velocityX = 1;
    } else if (enemyType === "fast") {
      enemyWidth = 25; enemyHeight = 25; velocityX = 2;
    } else if (enemyType === "big") {
      enemyWidth = 40; enemyHeight = 40; velocityX = 0.7;
    }
    const enemyX = roomStartX + 50 + seededRandom() * (ROOM_WIDTH - 100);
    const enemyY = 520 - (enemyHeight - 30);
    let rangeStart = enemyX - 50, rangeEnd = enemyX + 50;
    if (rangeStart < roomStartX) rangeStart = roomStartX;
    if (rangeEnd > roomStartX + ROOM_WIDTH) rangeEnd = roomStartX + ROOM_WIDTH;
    room.enemies.push({ 
      x: enemyX, 
      y: enemyY, 
      width: enemyWidth, 
      height: enemyHeight, 
      velocityX: velocityX, 
      range: [rangeStart, rangeEnd],
      animationFrame: 0,
      type: enemyType
    });
  }
  return room;
}

// ========= Inicialização das Salas =========
rooms[0] = generateRoom(0);
rooms[1] = generateRoom(1);
rooms[2] = generateRoom(2);

// ========= Atualização da UI =========
function updateUI() {
  const coinUI = document.getElementById('coinUI');
  if (coins > 0) {
    coinUI.style.display = 'block';
    document.getElementById('coinCount').textContent = coins;
  } else {
    coinUI.style.display = 'none';
  }
  const runeUI = document.getElementById('runeUI');
  if (runes > 0) {
    runeUI.style.display = 'block';
    document.getElementById('runeCount').textContent = runes;
  } else {
    runeUI.style.display = 'none';
  }
  const powers = ['escudo', 'impulso', 'velocidade', 'invisibilidade', 'magnetismo'];
  powers.forEach(power => {
    const uiElement = document.getElementById(power + 'UI');
    if (activePowers[power] > 0) {
      uiElement.style.display = 'block';
      document.getElementById(power + 'Timer').textContent = activePowers[power];
    } else {
      uiElement.style.display = 'none';
    }
  });
  const extraJumpsUI = document.getElementById('extraJumpsUI');
  if (player.maxAirJumps > 1) {
    extraJumpsUI.style.display = 'block';
    document.getElementById('extraJumpsCount').textContent = Math.max(player.remainingAirJumps - 1, 0);
  } else {
    extraJumpsUI.style.display = 'none';
  }
}

// ========= Atualização do Jogador =========
function updatePlayer() {
  // Movimento horizontal
  if (keys['ArrowLeft']) {
    let newX = player.x - player.speed;
    const leftBound = 100;
    if (newX < leftBound) {
      const roomKeys = Object.keys(rooms).map(Number);
      const minRoomKey = Math.min(...roomKeys);
      const allowedMinScroll = minRoomKey * ROOM_WIDTH - 100;
      let delta = newX - leftBound;
      if (scrollOffset + delta < allowedMinScroll) {
        delta = allowedMinScroll - scrollOffset;
      }
      scrollOffset += delta;
      player.x = leftBound;
    } else {
      player.x = newX;
    }
  } else if (keys['ArrowRight']) {
    let newX = player.x + player.speed;
    const rightBound = canvas.width / 2;
    if (newX > rightBound) {
      let delta = newX - rightBound;
      scrollOffset += delta;
      player.x = rightBound;
    } else {
      player.x = newX;
    }
  }

  // Salva a posição vertical anterior
  const prevY = player.y;
  
  // Atualiza verticalmente com gravidade
  player.velocityY += GRAVITY;
  player.y += player.velocityY;

  // Colisão com plataformas (somente se o jogador estiver caindo vindo de cima)
  let collided = false;
  for (let key in rooms) {
    for (let i = 0; i < rooms[key].platforms.length; i++) {
      const plat = rooms[key].platforms[i];
      const previousBottom = prevY + player.height;
      if (
        player.x < plat.x - scrollOffset + plat.width &&
        player.x + player.width > plat.x - scrollOffset &&
        player.y < plat.y + plat.height &&
        player.y + player.height > plat.y &&
        player.velocityY >= 0 &&
        previousBottom <= plat.y + 5
      ) {
        player.y = plat.y - player.height;
        player.velocityY = 0;
        collided = true;
        break;
      }
    }
    if (collided) break;
  }

  const absoluteX = player.x + scrollOffset;
  const newRoom = Math.floor(absoluteX / ROOM_WIDTH);
  if (newRoom > currentRoom) currentRoom = newRoom;

  // Pré-carrega as próximas 2 salas à direita
  for (let r = currentRoom + 1; r <= currentRoom + 2; r++) {
    if (!(r in rooms)) {
      rooms[r] = generateRoom(r);
    }
  }

  // Remove salas antigas se houver mais de 10
  const roomKeys = Object.keys(rooms).map(Number).sort((a, b) => a - b);
  if (roomKeys.length > 10) {
    delete rooms[roomKeys[0]];
  }
}

// ========= Atualização dos Inimigos =========
function updateEnemies() {
  for (let key in rooms) {
    rooms[key].enemies.forEach(enemy => {
      enemy.x += enemy.velocityX;
      enemy.animationFrame = (enemy.animationFrame + 1) % 360;
      if (enemy.x < enemy.range[0] || enemy.x + enemy.width > enemy.range[1]) {
        enemy.velocityX *= -1;
      }
    });
  }
}

// ========= Verificação de Colisões =========
function checkCollisions() {
  for (let key in rooms) {
    const room = rooms[key];

    // Moedas: coleta normal ou via magnetismo
    room.coins.forEach(coin => {
      if (!coin.collected) {
        if (
          player.x < coin.x - scrollOffset + coin.width &&
          player.x + player.width > coin.x - scrollOffset &&
          player.y < coin.y + coin.height &&
          player.y + player.height > coin.y
        ) {
          coin.collected = true;
          coins += 10;
          localStorage.setItem('coins', JSON.stringify(coins));
          updateUI();
        } else if (activePowers['magnetismo'] > 0) {
          const playerCenterX = player.x + player.width / 2;
          const playerCenterY = player.y + player.height / 2;
          const coinCenterX = coin.x - scrollOffset + coin.width / 2;
          const coinCenterY = coin.y + coin.height / 2;
          const dx = playerCenterX - coinCenterX;
          const dy = playerCenterY - coinCenterY;
          if (Math.sqrt(dx * dx + dy * dy) < 100) {
            coin.collected = true;
            coins += 10;
            localStorage.setItem('coins', JSON.stringify(coins));
            updateUI();
          }
        }
      }
    });

    // Runas
    room.runes.forEach(rune => {
      if (
        !rune.collected &&
        player.x < rune.x - scrollOffset + rune.width &&
        player.x + player.width > rune.x - scrollOffset &&
        player.y < rune.y + rune.height &&
        player.y + player.height > rune.y
      ) {
        rune.collected = true;
        runes++;
        localStorage.setItem('runes', JSON.stringify(runes));
        updateUI();
      }
    });

    // Power-ups
    room.powerUps.forEach(power => {
      if (
        !power.collected &&
        player.x < power.x - scrollOffset + power.width &&
        player.x + player.width > power.x - scrollOffset &&
        player.y < power.y + power.height &&
        player.y + player.height > power.y
      ) {
        power.collected = true;
        activePowers[power.type] = 300;
        updateUI();
      }
    });

    // Inimigos: se colidir sem proteção ou se com impulso, elimina e recompensa
    room.enemies.forEach(enemy => {
      if (
        player.x < enemy.x - scrollOffset + enemy.width &&
        player.x + player.width > enemy.x - scrollOffset &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
      ) {
        if (activePowers['escudo'] <= 0 && activePowers['invisibilidade'] <= 0) {
          if (activePowers['impulso'] > 0) {
            const idx = room.enemies.indexOf(enemy);
            if (idx > -1) {
              room.enemies.splice(idx, 1);
              if (Math.random() < 0.5) {
                coins += 15;
              } else {
                runes++;
              }
              updateUI();
            }
          } else {
            gameOver = true;
          }
        }
      }
    });

    // Espinhos
    room.spikes.forEach(spike => {
      if (
        player.x < spike.x - scrollOffset + spike.width &&
        player.x + player.width > spike.x - scrollOffset &&
        player.y < spike.y + spike.height &&
        player.y + player.height > spike.y
      ) {
        if (activePowers['escudo'] <= 0 && activePowers['invisibilidade'] <= 0) {
          gameOver = true;
        }
      }
    });
  }
}

// ========= Atualização dos Power-ups =========
function updatePowerUp() {
  for (let type in activePowers) {
    if (activePowers[type] > 0) {
      activePowers[type]--;
      if (type === 'impulso') {
        player.jumpForce = activePowers[type] > 0 ? -15 : -10;
      } else if (type === 'velocidade') {
        player.speed = activePowers[type] > 0 ? 5 : 3;
      }
    }
  }
  updateUI();
}

// ========= Função de Desenho =========
function draw() {
  // Fundo com gradiente vertical
  let bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGradient.addColorStop(0, "#111");
  bgGradient.addColorStop(1, "#000");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Desenha cada sala
  for (let key in rooms) {
    const room = rooms[key];

    // Plataformas com sombra
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    room.platforms.forEach(plat => {
      ctx.fillStyle = "#777";
      ctx.fillRect(plat.x - scrollOffset, plat.y, plat.width, plat.height);
    });
    ctx.shadowBlur = 0;

    // Moedas com flutuação e sombra
    room.coins.forEach(coin => {
      if (!coin.collected) {
        const offsetY = Math.sin((frameCount + coin.x) * 0.05) * 5;
        ctx.fillStyle = 'gold';
        ctx.shadowColor = "rgba(255,215,0,0.7)";
        ctx.shadowBlur = 6;
        ctx.fillRect(coin.x - scrollOffset, coin.y + offsetY, coin.width, coin.height);
        ctx.shadowBlur = 0;
      }
    });

    // Runas com oscilação e brilho
    room.runes.forEach(rune => {
      if (!rune.collected) {
        const offsetY = Math.sin((frameCount + rune.x) * 0.05) * 3;
        ctx.fillStyle = 'cyan';
        ctx.shadowColor = "rgba(0,255,255,0.7)";
        ctx.shadowBlur = 6;
        ctx.fillRect(rune.x - scrollOffset, rune.y + offsetY, rune.width, rune.height);
        ctx.shadowBlur = 0;
      }
    });

    // Power-ups com efeito pulsante
    room.powerUps.forEach(power => {
      if (!power.collected) {
        const pulse = Math.abs(Math.sin(frameCount * 0.1));
        let color;
        if (power.type === 'escudo') color = `rgba(0,0,255,${0.5 + pulse * 0.5})`;
        else if (power.type === 'impulso') color = `rgba(0,255,0,${0.5 + pulse * 0.5})`;
        else if (power.type === 'velocidade') color = `rgba(255,165,0,${0.5 + pulse * 0.5})`;
        else if (power.type === 'invisibilidade') color = `rgba(255,255,255,${0.5 + pulse * 0.5})`;
        else if (power.type === 'magnetismo') color = `rgba(255,0,255,${0.5 + pulse * 0.5})`;
        else color = 'gray';
        ctx.fillStyle = color;
        ctx.fillRect(power.x - scrollOffset, power.y, power.width, power.height);
      }
    });

    // Espinhos
    room.spikes.forEach(spike => {
      ctx.fillStyle = 'darkred';
      ctx.fillRect(spike.x - scrollOffset, spike.y, spike.width, spike.height);
    });

    // Inimigos com variação de cores e sombra
    room.enemies.forEach(enemy => {
      const enemyYOffset = Math.sin(frameCount * 0.1) * 2;
      if (enemy.type === 'normal') ctx.fillStyle = 'purple';
      else if (enemy.type === 'fast') ctx.fillStyle = 'red';
      else if (enemy.type === 'big') ctx.fillStyle = 'darkblue';
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 4;
      ctx.fillRect(enemy.x - scrollOffset, enemy.y + enemyYOffset, enemy.width, enemy.height);
      ctx.shadowBlur = 0;
    });
  }

  // Desenha o jogador com sombra
  ctx.fillStyle = player.color;
  ctx.shadowColor = "rgba(0,0,0,0.7)";
  ctx.shadowBlur = 6;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.shadowBlur = 0;

  // Desenha os indicadores dos poderes ativos (bordas concêntricas)
  let borderOffset = 0;
  if (activePowers['escudo'] > 0) {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;
    ctx.strokeRect(player.x - borderOffset, player.y - borderOffset, player.width + 2 * borderOffset, player.height + 2 * borderOffset);
    borderOffset += 4;
  }
  if (activePowers['impulso'] > 0) {
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 3;
    ctx.strokeRect(player.x - borderOffset, player.y - borderOffset, player.width + 2 * borderOffset, player.height + 2 * borderOffset);
    borderOffset += 4;
  }
  if (activePowers['velocidade'] > 0) {
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 3;
    ctx.strokeRect(player.x - borderOffset, player.y - borderOffset, player.width + 2 * borderOffset, player.height + 2 * borderOffset);
    borderOffset += 4;
  }
  if (activePowers['invisibilidade'] > 0) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeRect(player.x - borderOffset, player.y - borderOffset, player.width + 2 * borderOffset, player.height + 2 * borderOffset);
    borderOffset += 4;
  }
  if (activePowers['magnetismo'] > 0) {
    ctx.strokeStyle = 'magenta';
    ctx.lineWidth = 3;
    ctx.strokeRect(player.x - borderOffset, player.y - borderOffset, player.width + 2 * borderOffset, player.height + 2 * borderOffset);
    borderOffset += 4;
  }
  
  // Exibe a seed no canto superior direito
  ctx.fillStyle = 'white';
  ctx.font = "16px Arial";
  ctx.fillText("Seed: " + seed, canvas.width - 120, 20);
}

// ========= Loop Principal =========
function gameLoop() {
  if (gameOver) {
    let distancia = Math.floor(player.x + scrollOffset);
    coins += distancia;
    localStorage.setItem('coins', JSON.stringify(coins));
    localStorage.setItem('distanceTraveled', distancia);
    localStorage.setItem('coinsEarned', distancia);
    window.location.href = '/game_over';
    return;
  }
  frameCount++;
  updatePlayer();
  updateEnemies();
  updatePowerUp();
  checkCollisions();
  draw();
  requestAnimationFrame(gameLoop);
}

// Remove any dynamic loading of powers.js previously done.
// Instead, wrap event listener setup in DOMContentLoaded to be sure the document is ready 
// and that powers.js (loaded in the HTML) is available.

document.addEventListener('DOMContentLoaded', () => {
  // Set up key events once, using the functions from powers.js:
  document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') {
      if (player.velocityY === 0) {
        player.velocityY = player.jumpForce;
      } else if (player.remainingAirJumps > 0) {
        player.velocityY = player.jumpForce;
        player.remainingAirJumps = Math.max(player.remainingAirJumps - 1, 0);
        localStorage.setItem('extraJumps', JSON.stringify(player.remainingAirJumps));
        updateUI();
      }
    } else if (e.key === 'T') {
      useTeletransporte();
    } else if (e.key === 'C') {
      createClone();
    } else if (e.key === 'L') {
      shootLaser();
    } else if (e.key === 'M') {
      placeMine();
    } else if (e.key === 'G') {
      useGrapplingHook();
    } else if (e.key === 'B') {
      useSuperBlow();
    } else if (e.key === 'Q') {
      applyTimeControl();
    } else if (e.key === 'I') {
      applyInvertedWorld();
    } else if (e.key === 'F') {
      applyFlying();
    } else if (e.key === 'E') {
      applySpectralForm();
    } else if (e.key === 'S') {
      applySacredSword();
    } else if (e.key === 'A') {
      applyBoomerangEffect();
    } else if (e.key === 'W') {
      applyAquaticForm();
    } else if (e.key === 'R') {
      applyFreezing();
    } else if (e.key === 'U') {
      applyFury();
    } else if (e.key === 'P') {
      applySpinningBlade();
    } else if (e.key === 'H') {
      applyGradualHealing();
    } else if (e.key === 'K') {
      placeSpikeTrap();
    } else if (e.key === 'O') {
      useSpiritualLink();
    }
    // Add more key bindings for other abilities as needed
  });
  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });

  // Inicializa a UI e Inicia o Loop
  updateUI();
  gameLoop();
});
