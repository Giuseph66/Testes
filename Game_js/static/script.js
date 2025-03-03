// Canvas e contexto
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variáveis globais
let coins = 0, runes = 0;
let gameOver = false;
// Objeto para controlar os poderes ativos
let activePowers = {
  escudo: 0,
  impulso: 0,
  velocidade: 0,
  invisibilidade: 0,
  magnetismo: 0
};
let scrollOffset = 0;        // deslocamento global (x)
let currentRoom = 0;         // sala em que o jogador está
const ROOM_WIDTH = canvas.width; // cada sala tem 800px de largura
let frameCount = 0;          // contador global para animações

// Estrutura para armazenar as salas geradas
const rooms = {};

// Personagem HarryM
const player = {
  x: 50, y: 300,
  width: 30, height: 30,
  velocityX: 0, velocityY: 0,
  speed: 3,         
  jumpForce: -10,
  color: 'red'
};

// Física e controle de teclado
const GRAVITY = 0.3;
const keys = {};

// Função para gerar uma sala proceduralmente
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

  // Plataformas extras (2 a 4 por sala)
  const numPlatforms = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < numPlatforms; i++) {
    const platWidth = 80 + Math.random() * 70;
    const platX = roomStartX + Math.random() * (ROOM_WIDTH - platWidth);
    const platY = 300 + Math.random() * 200;
    room.platforms.push({ x: platX, y: platY, width: platWidth, height: 20 });
  }

  // Moedas (1 a 3)
  const numCoins = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < numCoins; i++) {
    const coinX = roomStartX + 50 + Math.random() * (ROOM_WIDTH - 100);
    const coinY = 250 + Math.random() * 200;
    room.coins.push({ x: coinX, y: coinY, width: 15, height: 15, collected: false });
  }

  // Runas (0 a 2)
  const numRunes = Math.floor(Math.random() * 3);
  for (let i = 0; i < numRunes; i++) {
    const runeX = roomStartX + 50 + Math.random() * (ROOM_WIDTH - 100);
    const runeY = 200 + Math.random() * 150;
    room.runes.push({ x: runeX, y: runeY, width: 20, height: 20, collected: false });
  }

  // Power-ups (0 a 2) – tipos: "escudo", "impulso", "velocidade", "invisibilidade" e "magnetismo"
  const numPowerUps = Math.floor(Math.random() * 3);
  const powerTypes = ['escudo', 'impulso', 'velocidade', 'invisibilidade', 'magnetismo'];
  for (let i = 0; i < numPowerUps; i++) {
    const pType = powerTypes[Math.floor(Math.random() * powerTypes.length)];
    const pX = roomStartX + 50 + Math.random() * (ROOM_WIDTH - 100);
    const pY = 220 + Math.random() * 200;
    room.powerUps.push({ type: pType, x: pX, y: pY, width: 20, height: 20, collected: false });
  }

  // Espinhos (1 a 3)
  const numSpikes = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < numSpikes; i++) {
    const spikeX = roomStartX + 50 + Math.random() * (ROOM_WIDTH - 100);
    room.spikes.push({ x: spikeX, y: 530, width: 30, height: 20 });
  }

  // Inimigos (2 a 4) – com variações de tipo
  const numEnemies = 2 + Math.floor(Math.random() * 3);
  const enemyTypes = ["normal", "fast", "big"];
  for (let i = 0; i < numEnemies; i++) {
    const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    let enemyWidth, enemyHeight, velocityX;
    // Define atributos com base no tipo do inimigo
    if (enemyType === "normal") {
      enemyWidth = 30; enemyHeight = 30; velocityX = 1;
    } else if (enemyType === "fast") {
      enemyWidth = 25; enemyHeight = 25; velocityX = 2;
    } else if (enemyType === "big") {
      enemyWidth = 40; enemyHeight = 40; velocityX = 0.7;
    }
    const enemyX = roomStartX + 50 + Math.random() * (ROOM_WIDTH - 100);
    const enemyY = 520 - (enemyHeight - 30); // Ajusta a posição vertical conforme o tamanho
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

// Pré-carrega as salas iniciais (0, 1 e 2)
rooms[0] = generateRoom(0);
rooms[1] = generateRoom(1);
rooms[2] = generateRoom(2);

// Atualiza a UI – cada container (com seu respectivo ID) só é exibido se seu valor for diferente de 0
function updateUI() {
  // Para moedas
  const coinUI = document.getElementById('coinUI');
  if (coins > 0) {
    coinUI.style.display = 'block';
    document.getElementById('coinCount').textContent = coins;
  } else {
    coinUI.style.display = 'none';
  }
  // Para runas
  const runeUI = document.getElementById('runeUI');
  if (runes > 0) {
    runeUI.style.display = 'block';
    document.getElementById('runeCount').textContent = runes;
  } else {
    runeUI.style.display = 'none';
  }
  // Para cada poder
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
}

// Atualiza o jogador, aplicando física, colisões e carregamento dinâmico das salas
function updatePlayer() {
  // Movimentação horizontal com panning à esquerda e direita
  if (keys['ArrowLeft']) {
    let newX = player.x - player.speed;
    const leftBound = 100; // limite para iniciar o panning à esquerda
    if (newX < leftBound) {
      const roomKeys = Object.keys(rooms).map(Number);
      const minRoomKey = Math.min(...roomKeys);
      const allowedMinScroll = minRoomKey * ROOM_WIDTH - 100;
      let delta = newX - leftBound; // valor negativo
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
    const rightBound = canvas.width / 2; // limite para panning à direita
    if (newX > rightBound) {
      let delta = newX - rightBound;
      scrollOffset += delta;
      player.x = rightBound;
    } else {
      player.x = newX;
    }
  }

  // Aplica a gravidade
  player.velocityY += GRAVITY;
  player.y += player.velocityY;

  // Colisão com plataformas (corrigida para evitar teletransporte)
  let collided = false;
  for (let key in rooms) {
    for (let i = 0; i < rooms[key].platforms.length; i++) {
      const plat = rooms[key].platforms[i];
      const previousBottom = player.y + player.height - player.velocityY;
      if (
        player.x < plat.x - scrollOffset + plat.width &&
        player.x + player.width > plat.x - scrollOffset &&
        player.y < plat.y + plat.height &&
        player.y + player.height > plat.y &&
        player.velocityY >= 0 &&
        previousBottom <= plat.y
      ) {
        player.y = plat.y - player.height;
        player.velocityY = 0;
        collided = true;
        break;
      }
    }
    if (collided) break;
  }

  // Determina a sala atual com base na posição absoluta
  const absoluteX = player.x + scrollOffset;
  const newRoom = Math.floor(absoluteX / ROOM_WIDTH);
  if (newRoom > currentRoom) {
    currentRoom = newRoom;
  }

  // Pré-carrega as próximas 2 salas (somente para a direita)
  for (let r = currentRoom + 1; r <= currentRoom + 2; r++) {
    if (!(r in rooms)) {
      rooms[r] = generateRoom(r);
    }
  }

  // Remove salas antigas se houver mais de 10 carregadas
  const roomKeys = Object.keys(rooms).map(Number).sort((a, b) => a - b);
  if (roomKeys.length > 10) {
    delete rooms[roomKeys[0]];
  }
}

// Atualiza os inimigos de todas as salas (movimentação e animação simples)
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

// Verifica colisões com colecionáveis, power-ups, inimigos e espinhos
function checkCollisions() {
  for (let key in rooms) {
    const room = rooms[key];

    // Moedas (com animação de flutuação e efeito de magnetismo)
    room.coins.forEach(coin => {
      if (!coin.collected) {
        // Coleta por colisão normal
        if (
          player.x < coin.x - scrollOffset + coin.width &&
          player.x + player.width > coin.x - scrollOffset &&
          player.y < coin.y + coin.height &&
          player.y + player.height > coin.y
        ) {
          coin.collected = true;
          coins += 10;
          updateUI();
        }
        // Coleta pelo magnetismo se ativo (dentro de 100px do centro do jogador)
        else if (activePowers['magnetismo'] > 0) {
          const playerCenterX = player.x + player.width / 2;
          const playerCenterY = player.y + player.height / 2;
          const coinCenterX = coin.x - scrollOffset + coin.width / 2;
          const coinCenterY = coin.y + coin.height / 2;
          const dx = playerCenterX - coinCenterX;
          const dy = playerCenterY - coinCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            coin.collected = true;
            coins += 10;
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
        activePowers[power.type] = 300; // duração em frames
        updateUI();
      }
    });

    // Inimigos – se colidir sem proteção (escudo ou invisibilidade) ou, se com impulso, elimina e recompensa
    room.enemies.forEach(enemy => {
      if (
        player.x < enemy.x - scrollOffset + enemy.width &&
        player.x + player.width > enemy.x - scrollOffset &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
      ) {
        if (activePowers['escudo'] <= 0 && activePowers['invisibilidade'] <= 0) {
          if (activePowers['impulso'] > 0) {
            // Remove o inimigo e aplica recompensa
            const idx = room.enemies.indexOf(enemy);
            if (idx > -1) {
              room.enemies.splice(idx, 1);
              // Recompensa: 50% chance de ganhar moedas (15) ou uma runa
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

    // Espinhos – desconsidera colisão se escudo ou invisibilidade estiverem ativos
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

// Atualiza os power-ups ativos e seus efeitos
function updatePowerUp() {
  for (let type in activePowers) {
    if (activePowers[type] > 0) {
      activePowers[type]--;
      if (activePowers[type] === 0) {
        if (type === 'impulso') {
          player.jumpForce = -10;
        } else if (type === 'velocidade') {
          player.speed = 3;
        }
      } else {
        if (type === 'impulso') {
          player.jumpForce = -15;
        } else if (type === 'velocidade') {
          player.speed = 5;
        }
      }
    }
  }
  updateUI();
}

// Função que desenha todos os elementos de todas as salas com animações simples
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha cada sala carregada
  for (let key in rooms) {
    const room = rooms[key];

    // Plataformas
    room.platforms.forEach(plat => {
      ctx.fillStyle = '#777';
      ctx.fillRect(plat.x - scrollOffset, plat.y, plat.width, plat.height);
    });

    // Moedas com leve flutuação
    room.coins.forEach(coin => {
      if (!coin.collected) {
        const offsetY = Math.sin((frameCount + coin.x) * 0.05) * 5;
        ctx.fillStyle = 'gold';
        ctx.fillRect(coin.x - scrollOffset, coin.y + offsetY, coin.width, coin.height);
      }
    });

    // Runas com leve oscilação
    room.runes.forEach(rune => {
      if (!rune.collected) {
        const offsetY = Math.sin((frameCount + rune.x) * 0.05) * 3;
        ctx.fillStyle = 'cyan';
        ctx.fillRect(rune.x - scrollOffset, rune.y + offsetY, rune.width, rune.height);
      }
    });

    // Power-ups com efeito pulsante
    room.powerUps.forEach(power => {
      if (!power.collected) {
        const pulse = Math.abs(Math.sin(frameCount * 0.1));
        ctx.fillStyle =
          power.type === 'escudo'
            ? `rgba(0,0,255,${0.5 + pulse * 0.5})`
            : power.type === 'impulso'
            ? `rgba(0,255,0,${0.5 + pulse * 0.5})`
            : power.type === 'velocidade'
            ? `rgba(255,165,0,${0.5 + pulse * 0.5})`
            : power.type === 'invisibilidade'
            ? `rgba(255,255,255,${0.5 + pulse * 0.5})`
            : `rgba(255,0,255,${0.5 + pulse * 0.5})`; // magnetismo
        ctx.fillRect(power.x - scrollOffset, power.y, power.width, power.height);
      }
    });

    // Espinhos
    room.spikes.forEach(spike => {
      ctx.fillStyle = 'darkred';
      ctx.fillRect(spike.x - scrollOffset, spike.y, spike.width, spike.height);
    });

    // Inimigos – variação de cores de acordo com o tipo
    room.enemies.forEach(enemy => {
      const enemyYOffset = Math.sin(frameCount * 0.1) * 2;
      if (enemy.type === 'normal') {
        ctx.fillStyle = 'purple';
      } else if (enemy.type === 'fast') {
        ctx.fillStyle = 'red';
      } else if (enemy.type === 'big') {
        ctx.fillStyle = 'darkblue';
      }
      ctx.fillRect(enemy.x - scrollOffset, enemy.y + enemyYOffset, enemy.width, enemy.height);
    });
  }

  // Desenha o jogador
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Indicadores visuais dos poderes ativos (bordas concêntricas)
  let borderOffset = 0;
  if (activePowers['escudo'] > 0) {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;
    ctx.strokeRect(
      player.x - borderOffset,
      player.y - borderOffset,
      player.width + 2 * borderOffset,
      player.height + 2 * borderOffset
    );
    borderOffset += 4;
  }
  if (activePowers['impulso'] > 0) {
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 3;
    ctx.strokeRect(
      player.x - borderOffset,
      player.y - borderOffset,
      player.width + 2 * borderOffset,
      player.height + 2 * borderOffset
    );
    borderOffset += 4;
  }
  if (activePowers['velocidade'] > 0) {
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 3;
    ctx.strokeRect(
      player.x - borderOffset,
      player.y - borderOffset,
      player.width + 2 * borderOffset,
      player.height + 2 * borderOffset
    );
    borderOffset += 4;
  }
  if (activePowers['invisibilidade'] > 0) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeRect(
      player.x - borderOffset,
      player.y - borderOffset,
      player.width + 2 * borderOffset,
      player.height + 2 * borderOffset
    );
    borderOffset += 4;
  }
  if (activePowers['magnetismo'] > 0) {
    ctx.strokeStyle = 'magenta';
    ctx.lineWidth = 3;
    ctx.strokeRect(
      player.x - borderOffset,
      player.y - borderOffset,
      player.width + 2 * borderOffset,
      player.height + 2 * borderOffset
    );
    borderOffset += 4;
  }
}

// Loop principal do jogo
function gameLoop() {
  if (gameOver) {
    alert("Game Over! Você foi longe: " + Math.floor(player.x + scrollOffset) +" MP.");
    window.location.reload();
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

// Eventos de teclado
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  // Pulo: somente se estiver no chão/plataforma
  if (e.key === ' ' && player.velocityY === 0) {
    player.velocityY = player.jumpForce;
  }
});
window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Inicia a UI e o loop do jogo
updateUI();
gameLoop();
