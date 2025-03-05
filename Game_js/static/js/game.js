// ========= Sistema de Seed =========
// Defina uma seed padrão ou use uma que venha do localStorage// Recupera a seed do localStorage (convertendo para número, se necessário)
let seed = parseInt(localStorage.getItem('seed'));
// Função seededRandom() usando LCG
function seededRandom() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

let clones = [];
// ========= Configuração do Canvas =========
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// ========= Variáveis Globais =========
let coins = JSON.parse(localStorage.getItem('coins')) || 0;
let runes = JSON.parse(localStorage.getItem('runes')) || 0;
let gameOver = false;
let mundo_invertido = false;
window.timeControlActive = false;
window.Inverter = false;
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
let passiveAbilities = JSON.parse(localStorage.getItem('abilities')) || [];

let airTime = 0;
let extraJumpCount = 0;
let rocketEnemyActive = false;

const rocketEnemy = {
  x: -2000,
  y: 0,
  width: 50,
  height: 20,
  speed: 8,
  active: false
};

let cooldowns = {
  teletransporte: [0,0] ,
plataformaextra: [0,0] ,
controledotempo: [0,0] ,
mundoinvertido: [0,0] ,
voar: [0,0] ,
raiolaser: [0,0] ,
escalada: [0,0] ,
espectro: [0,0] ,
espadasagrada: [0,0] ,
efeitobumerangue: [0,0] ,
formaaquática: [0,0] ,
congelamento: [0,0] ,
fúria: [0,0] ,
minaprogramável: [0,0] ,
laminaGiratoria: [0,0] ,
curagradual: [0,0] ,
armadilhadeespinhos: [0,0] ,
corda_gancho: [0,0] ,
eloespiritual: [0,0] ,
supersopro: [0,0] 
};

function updateCooldowns() {
  for (let ability in cooldowns) {
    if (cooldowns[ability][0] > 0) {
      cooldowns[ability][0] -= 1000 / 60; // Assuming 60 FPS
      if (cooldowns[ability][0] < 0) cooldowns[ability][0] = 0;
    }
  }
}

function drawCooldownBars() {
  const abilities = Object.keys(cooldowns);
  abilities.forEach((ability) => {
    const cooldown = cooldowns[ability][0];
    const maxCooldown = cooldowns[ability][1];
    const abilityElement = document.getElementById(ability.toLowerCase()+"Carrega");
    if (cooldown > 0) {
      //console.log(cooldown,maxCooldown)
      if (abilityElement) {
          const porcentagem = ((maxCooldown - cooldown) / maxCooldown) * 100; 
          abilityElement.style.display = 'block';
          abilityElement.style.width = `${100-porcentagem}%`; 
        }
      }else{ if (abilityElement) {
        setTimeout(() => {
        abilityElement.style.display = 'none';
        abilityElement.style.width = `0%`; 
      }, 1000);}
      }
  });
}

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
let GRAVITY = 0.3;
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
  // Armazena a posição vertical anterior para verificação de colisão
  const prevY = player.y;
  if (player.y < 0) {
    player.y = 0;
    player.velocityY = 0;
  }
  // Movimento horizontal (o seu código existente para mover o player)
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

  // Colisão com clones (trata os clones como plataformas)
  if (!collided) {
    for (let clone of clones) {
      const previousBottom = prevY + player.height;
      if (
        player.x < clone.x - scrollOffset + clone.width &&
        player.x + player.width > clone.x - scrollOffset &&
        player.y < clone.y + clone.height &&
        player.y + player.height > clone.y &&
        player.velocityY >= 0 &&
        previousBottom <= clone.y + 5
      ) {
        player.y = clone.y - player.height;
        player.velocityY = 0;
        collided = true;
        break;
      }
    }
  }

  // Atualiza a sala atual com base na posição
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
  if (mundo_invertido){
    if (player.y>300) {
      airTime += 1 / 60; 
    }else {
      airTime = 0;
      extraJumpCount = 0;
      rocketEnemyActive = false;
    }
  }else{
    if (player.y<300) {
      airTime += 1 / 60; 
    }else {
      airTime = 0;
      extraJumpCount = 0;
      rocketEnemyActive = false;
    }
  }

  if (airTime > 8 || extraJumpCount > 10) {
    rocketEnemyActive = true;
    rocketEnemy.active = true;
    rocketEnemy.y = player.y; 
  }else{
    rocketEnemy.x= -1000;
    rocketEnemy.active = false;
  }
}

// ========= Atualização dos Inimigos =========
function updateEnemies() {
  for (let key in rooms) {
    rooms[key].enemies.forEach(enemy => {
      // Se o controle do tempo estiver ativo, os inimigos se movem a 30% da velocidade normal
      const speedFactor = window.timeControlActive ? 0.1 : 1;
      //console.log(speedFactor,window.timeControlActive,GRAVITY);
      enemy.x += enemy.velocityX * speedFactor;
      enemy.animationFrame = (enemy.animationFrame + 1) % 360;
      // Verifica limites e inverte a velocidade se necessário
      if (enemy.x < enemy.range[0] || enemy.x + enemy.width > enemy.range[1]) {
        enemy.velocityX *= -1;
      }
    });
  }

  // Update rocket enemy
  if (rocketEnemy.active) {
    rocketEnemy.x += rocketEnemy.speed;
    if (rocketEnemy.x > canvas.width) {
      rocketEnemy.x = -50;
    }
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
        activePowers[power.type] += 300;
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

  // Check collision with rocket enemy
  if (rocketEnemy.active) {
    if (
      player.x < rocketEnemy.x + rocketEnemy.width &&
      player.x + player.width > rocketEnemy.x &&
      player.y < rocketEnemy.y + rocketEnemy.height &&
      player.y + player.height > rocketEnemy.y
    ) {
      if (activePowers['escudo'] <= 0 && activePowers['invisibilidade'] <= 0) {
        gameOver = true;
      }
    }
  }
}

function checkCanvasCollisions() {
  // Check collision with the top of the canvas
  if (player.y < 0) {
    player.y = 0;
    player.velocityY = 0;
  }

  // Check collision with the bottom of the canvas
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.velocityY = 0;
  }

  // Check collision with the left of the canvas
  if (player.x < 0) {
    player.x = 0;
    player.velocityX = 0;
  }

  // Check collision with the right of the canvas
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
    player.velocityX = 0;
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
  let semente = parseInt(localStorage.getItem('seed'));
  ctx.fillStyle = 'white';
  ctx.font = "16px Arial";
  ctx.fillText("Seed: " + semente, canvas.width - 120, 20);
  ctx.fillText("MP: " + Math.floor(player.x + scrollOffset), 0, 20);
  
  // Draw rocket enemy
  if (rocketEnemy.active) {
    ctx.fillStyle = 'red';
    ctx.fillText("!!!!",0, rocketEnemy.y);
    ctx.fillText("-".repeat(canvas.width),0, 300);
    ctx.fillStyle = 'green';
    ctx.fillRect(rocketEnemy.x, rocketEnemy.y, rocketEnemy.width, rocketEnemy.height);
  }
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
  checkCanvasCollisions(); // Add this line to check canvas collisions
  updateCooldowns(); // Add this line to update cooldowns
  draw();
  drawCooldownBars(); // Add this line to draw cooldown bars
  requestAnimationFrame(gameLoop);
  updateClones();
}

// Remove any dynamic loading of powers.js previously done.
// Instead, wrap event listener setup in DOMContentLoaded to be sure the document is ready 
// and that powers.js (loaded in the HTML) is available.
function updateClones() {
  if (clones.length > 0) {
    const now = Date.now();
    clones.forEach(clone => {
      // Calcula a transparência com base no tempo restante
      const elapsedTime = now - clone.spawnTime;
      const progress = elapsedTime / clone.duration;
      const alpha = Math.max(0, 1 - progress); // Diminui de 1 para 0 conforme o tempo passa

      // Desenha o clone com transparência
      ctx.fillStyle = clone.color;
      ctx.globalAlpha = alpha; // Aplica a transparência
      ctx.fillRect(clone.x - scrollOffset, clone.y, clone.width, clone.height);
      ctx.globalAlpha = 1.0; // Reseta a transparência para os demais elementos

      // Atualiza a posição do clone
      clone.x += clone.velocityX;
      clone.y += clone.velocityY;
    });
    
    // Remove clones que excederam sua duração
    clones = clones.filter(clone => now - clone.spawnTime < clone.duration);
  }
}



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
        extraJumpCount++;
      }
    } else if (e.key.toUpperCase() === 'T' && cooldowns.teletransporte[0] === 0) {
      useTeletransporte();
      cooldowns.teletransporte[0] = 5000 - 5000 * (player.teleport?.level/100 || 1); // Example cooldown duration
      cooldowns.teletransporte[1] = 5000 - 5000 * (player.teleport?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'C' && cooldowns.plataformaextra[0] === 0) {
      createClone();
      cooldowns.plataformaextra[0] =5000 - 5000 * (player.clone?.level/100 || 1); // Example cooldown duration
      cooldowns.plataformaextra[1] =5000 - 5000 * (player.clone?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'L' && cooldowns.raiolaser[0] === 0) {
      shootLaser();
      cooldowns.raiolaser[0] =5000 - 5000 * (player.laser?.level/100 || 1); // Example cooldown duration
      cooldowns.raiolaser[1] =5000 - 5000 * (player.laser?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'M' && cooldowns.mina[0] === 0) {
      placeMine();
      cooldowns.mina[0] =5000 - 5000 * (player.mine?.level/100 || 1); // Example cooldown duration
      cooldowns.mina[1] =5000 - 5000 * (player.mine?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'G' && cooldowns.corda_gancho[0] === 0) {
      useGrapplingHook();
      cooldowns.corda_gancho[0] =5000 - 5000 * (player.grapplingHook?.level/100 || 1); // Example cooldown duration
      cooldowns.corda_gancho[1] =5000 - 5000 * (player.grapplingHook?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'B' && cooldowns.supersopro[0] === 0) {
      useSuperBlow();
      cooldowns.supersopro[0] =5000 - 5000 * (player.superBlow?.level/100 || 1); // Example cooldown duration
      cooldowns.supersopro[1] =5000 - 5000 * (player.superBlow?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'Q' && cooldowns.controledotempo[0] === 0) {
      applyTimeControl();
      cooldowns.controledotempo[0] =5000 - 5000 * (player.timeControl?.level/100 || 1); // Example cooldown duration
      cooldowns.controledotempo[1] =5000 - 5000 * (player.timeControl?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'I' && cooldowns.mundoinvertido[0] === 0) {
      applyInvertedWorld();
      cooldowns.mundoinvertido[0] =5000 - 5000 * (player.invertedWorld?.level/100 || 1); // Example cooldown duration
      cooldowns.mundoinvertido[1] =5000 - 5000 * (player.invertedWorld?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'F' && cooldowns.voar[0] === 0) {
      applyFlying();
      cooldowns.voar[0] =5000 - 5000 * (player.canFly?.level/100 || 1); // Example cooldown duration
      cooldowns.voar[1] =5000 - 5000 * (player.canFly?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'E' && cooldowns.escalada[0] === 0) {
      applyClimbing();
      cooldowns.escalada[0] =5000 - 5000 * (player.canClimb?.level/100 || 1); // Example cooldown duration
      cooldowns.escalada[1] =5000 - 5000 * (player.canClimb?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'S' && cooldowns.espadasagrada[0] === 0) {
      applySacredSword();
      cooldowns.espadasagrada[0] =5000 - 5000 * (player.sacredSword?.level/100 || 1); // Example cooldown duration
      cooldowns.espadasagrada[1] =5000 - 5000 * (player.sacredSword?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'A' && cooldowns.efeitobumerangue[0] === 0) {
      applyBoomerangEffect();
      cooldowns.efeitobumerangue[0] =5000 - 5000 * (player.boomerang?.level/100 || 1); // Example cooldown duration
      cooldowns.efeitobumerangue[1] =5000 - 5000 * (player.boomerang?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'W' && cooldowns.formaaquática[0] === 0) {
      applyAquaticForm();
      cooldowns.formaaquática[0] =5000 - 5000 * (player.aquaticForm?.level/100 || 1); // Example cooldown duration
      cooldowns.formaaquática[1] =5000 - 5000 * (player.aquaticForm?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'R' && cooldowns.congelamento[0] === 0) {
      applyFreezing();
      cooldowns.congelamento[0] =5000 - 5000 * (player.freezing?.level/100 || 1); // Example cooldown duration
      cooldowns.congelamento[1] =5000 - 5000 * (player.freezing?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'U' && cooldowns.fúria[0] === 0) {
      applyFury();
      cooldowns.fúria[0] =5000 - 5000 * (player.fury?.level/100 || 1); // Example cooldown duration
      cooldowns.fúria[1] =5000 - 5000 * (player.fury?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'P' && cooldowns.laminaGiratoria[0] === 0) {
      applySpinningBlade();
      cooldowns.laminaGiratoria[0] =5000 - 5000 * (player.spinningBlade?.level/100 || 1); // Example cooldown duration
      cooldowns.laminaGiratoria[1] =5000 - 5000 * (player.spinningBlade?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'H' && cooldowns.curagradual[0] === 0) {
      applyGradualHealing();
      cooldowns.curagradual[0] =5000 - 5000 * (player.gradualHealing?.level/100 || 1); // Example cooldown duration
      cooldowns.curagradual[1] =5000 - 5000 * (player.gradualHealing?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'K' && cooldowns.armadilhadeespinhos[0] === 0) {
      placeSpikeTrap();
      cooldowns.armadilhadeespinhos[0] =5000 - 5000 * (player.spikeTrap?.level/100 || 1); // Example cooldown duration
      cooldowns.armadilhadeespinhos[1] =5000 - 5000 * (player.spikeTrap?.level/100 || 1); // Example cooldown duration
    } else if (e.key.toUpperCase() === 'O' && cooldowns.eloespiritual[0] === 0) {
      useSpiritualLink();
      cooldowns.eloespiritual[0] =5000 - 5000 * (player.spiritualLink?.level/100 || 1); // Example cooldown duration
      cooldowns.eloespiritual[1] =5000 - 5000 * (player.spiritualLink?.level/100 || 1); // Example cooldown duration
    }
    // Add more key bindings for other abilities as needed
  });
  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });

  // Inicializa a UI e Inicia o Loop
  updateUI();
  applyPassiveAbilities();
  gameLoop();
});

// Function to display active abilities
function displayActiveAbilities() {
  const activeAbilitiesList = document.getElementById('activeAbilitiesList');
  activeAbilitiesList.innerHTML = '';
  passiveAbilities.forEach(ability => {
    const li = document.createElement('li');
    li.textContent = ability.name;
    activeAbilitiesList.appendChild(li);
  });
}

// Function to display power information
function displayPowerInfo() {
  const powerInfoList = document.getElementById('powerInfoList');
  powerInfoList.innerHTML = '';
  passiveAbilities.forEach(ability => {
    const carrega = document.createElement('div');
    const li = document.createElement('li');
    carrega.id = (ability.name).replace(/ /g,"").toLowerCase().replace("/", "_")+"Carrega";
    carrega.style.position = "absolute"; // Posicionamento absoluto
    carrega.style.top = "0"; // Alinha ao topo do <li>
    carrega.style.left = "0"; // Alinha à esquerda do <li>
    carrega.style.width = "0%"; // Começa com 0% de largura
    carrega.style.height = "100%"; // Altura completa do <li>
    carrega.style.backgroundColor = "rgba(255, 0, 0, 0.42)"; // Cor de fundo (vermelho semi-transparente)
    carrega.style.transition = "width 0.5s ease"; // Animação suave da largura
    carrega.style.zIndex = "99"; // Coloca acima do texto
    li.innerHTML = `<strong>${ability.name} (${ability.level})</strong>: ${ability.description} <br> <em>Ativar com a tecla: ${ability.key}</em>`;
    li.style.position = "relative";
    li.appendChild(carrega);
    powerInfoList.appendChild(li);
  });
}

function applyPassiveAbilities() {
  passiveAbilities.forEach(ability => {
    if (ability.name === 'Teletransporte') {
      ability.key = 'T';
      player.teleport = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Plataforma Extra') {
      ability.key = 'C';
      player.clone = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Controle do Tempo') {
      ability.key = 'Q';
      player.timeControl = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Mundo Invertido') {
      ability.key = 'I';
      player.invertedWorld = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Voar') {
      ability.key = 'F';
      player.canFly = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Raio Laser') {
      ability.key = 'L';
      player.laser = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Escalada') {
      ability.key = 'E';
      player.canClimb = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Espectro') {
      ability.key = 'E'; // Se desejar uma tecla diferente, altere aqui
      player.spectralForm = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Espada Sagrada') {
      ability.key = 'S';
      player.sacredSword = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Efeito Bumerangue') {
      ability.key = 'A';
      player.boomerang = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Forma Aquática') {
      ability.key = 'W';
      player.aquaticForm = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Congelamento') {
      ability.key = 'R';
      player.freezing = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Fúria') {
      ability.key = 'U';
      player.fury = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Mina Programável') {
      ability.key = 'M';
      player.mine = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Lâmina Giratória') {
      ability.key = 'P';
      player.spinningBlade = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Cura Gradual') {
      ability.key = 'H';
      player.gradualHealing = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Armadilha de Espinhos') {
      ability.key = 'K';
      player.spikeTrap = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Corda/Gancho') {
      ability.key = 'G';
      player.grapplingHook = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Elo Espiritual') {
      ability.key = 'O';
      player.spiritualLink = { level: ability.level || 1, key: ability.key };
    } else if (ability.name === 'Super Sopro') {
      ability.key = 'B';
      player.superBlow = { level: ability.level || 1, key: ability.key };
    }
  });
  displayActiveAbilities();
  displayPowerInfo();
}

