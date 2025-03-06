function useTeletransporte() {
  if (player.teleport) {
    const distance = 100 + ((player.teleport.level*0.3)*100 || 1); // Increase distance with level
    player.x += distance;
  }
}

function createClone() {
  console.log(player.x, player.y, player.width, player.height);
  if (player.clone) {
    const clone = {
      x: player.x+ scrollOffset, 
      y: player.y+ player.height+3,
      width: player.width*2,
      height: player.height/2,
      color: 'rgb(81, 81, 81,1)',
      velocityY: 0,
      velocityX: 0,
      duration: 3000 + 3000*(player.clone.level/100 || 1), // Increase duration with level
      spawnTime: Date.now(),
      isClone: true 
    };
    // Adiciona o clone ao array para que seja processado no game loop
    clones.push(clone);
  }
}

// Define a flag no objeto global
window.timeControlActive = false;

function applyTimeControl() {
  if (player.timeControl) {
    const duration = 5000 + 5000 * (player.timeControl.level/100 || 1); // Duração aumenta com o nível
    GRAVITY = 0.06;
    window.timeControlActive = true;
    player.jumpForce= -4.5;
    rocketEnemy.speed = 1;
    setTimeout(() => {
      rocketEnemy.speed = 8;
      player.jumpForce = -10;
      GRAVITY = 0.3;
      window.timeControlActive = false;
    }, duration);
  }
}


//mundo invertido
function applyInvertedWorld() {
  if (player.invertedWorld) {
function invertYAxis() {
  const canvasHeight = canvas.height;
  mundo_invertido = !mundo_invertido;

  // Invert player position and velocity
  player.y = canvasHeight - player.y - player.height;
  player.velocityY = -player.velocityY;

  // Invert positions of platforms
  for (let key in rooms) {
    rooms[key].platforms.forEach(platform => {
      platform.y = canvasHeight - platform.y - platform.height;
    });
  }

  // Invert positions of coins
  for (let key in rooms) {
    rooms[key].coins.forEach(coin => {
      coin.y = canvasHeight - coin.y - coin.height;
    });
  }

  // Invert positions of runes
  for (let key in rooms) {
    rooms[key].runes.forEach(rune => {
      rune.y = canvasHeight - rune.y - rune.height;
    });
  }

  // Invert positions of power-ups
  for (let key in rooms) {
    rooms[key].powerUps.forEach(powerUp => {
      powerUp.y = canvasHeight - powerUp.y - powerUp.height;
    });
  }

  // Invert positions of spikes
  for (let key in rooms) {
    rooms[key].spikes.forEach(spike => {
      spike.y = canvasHeight - spike.y - spike.height;
    });
  }

  // Invert positions of enemies
  for (let key in rooms) {
    rooms[key].enemies.forEach(enemy => {
      enemy.y = canvasHeight - enemy.y - enemy.height;
      enemy.velocityY = -enemy.velocityY;
    });
  }

  // Invert positions of clones
  clones.forEach(clone => {
    clone.y = canvasHeight - clone.y - clone.height;
    clone.velocityY = -clone.velocityY;
  });
  
}
    invertYAxis()
  }
}

// Voar
function applyFlying() {
  if (player.canFly) {
    const duration = 5000+5000 * (player.canFly.level/100 || 1); // Increase duration with level
    player.velocityY -= 10;
    fly=true;
    let anterior=GRAVITY
    GRAVITY=0.2;
    setTimeout(() => { GRAVITY = anterior; fly=false;}, duration);
  }
}

// Raio Laser
function shootLaser() {
  if (player.laser) {
    const laser = {
      x: player.facingRight ? player.x + player.width : player.x - canvas.width,
      y: player.y + player.height / 2,
      width: canvas.width,
      height: 5,
      direction: player.facingRight ? 1 : -1,
      duration: 1 + 1 * (player.laser.level/100 || 1) // Increase duration with level
    };
    lasers.push(laser);
  }
}

// Escalada
function applyClimbing() {
  if (player.canClimb) {
    const duration = 5000 * (player.canClimb.level || 1); // Increase duration with level
    dencidade=true;
    setTimeout(() => { dencidade=false; }, duration);
  }
}

// Espectro
function applySpectralForm() {
  if (player.spectralForm) {
    const duration = 5000 * (player.spectralForm.level || 1); // Increase duration with level
    player.invincible = true;
    setTimeout(() => { player.invincible = false; }, duration);
  }
}

// Espada Sagrada
function applySacredSword() {
  if (player.sacredSword) {
    const duration = 5000 * (player.sacredSword.level || 1); // Increase duration with level
    player.attackPower = 2;
    setTimeout(() => { player.attackPower = 1; }, duration);
  }
}

// Efeito Bumerangue
function applyBoomerangEffect() {
  if (player.boomerang) {
    const boomerang = { x: player.x + player.width, y: player.y + player.height / 2, width: 10, height: 2 };
    // Add boomerang to the game (this is just an example, you need to handle it properly in your game logic)
  }
}

// Forma Aquática
function applyAquaticForm() {
  if (player.aquaticForm) {
    const duration = 5000 * (player.aquaticForm.level || 1); // Increase duration with level
    player.velocityY = -2;
    setTimeout(() => { player.velocityY = 0; }, duration);
  }
}

// Congelamento
function applyFreezing() {
  if (player.freezing) {
    const duration = 5000 * (player.freezing.level || 1); // Increase duration with level
    rooms.forEach(room => {
      room.enemies.forEach(enemy => {
        enemy.frozen = true;
        setTimeout(() => { enemy.frozen = false; }, duration);
      });
    });
  }
}

// Fúria
function applyFury() {
  if (player.fury) {
    const duration = 5000 * (player.fury.level || 1); // Increase duration with level
    player.speed *= 2;
    player.attackPower = 2;
    setTimeout(() => {
      player.speed = 2;
      player.attackPower = 1;
    }, duration);
  }
}

// Mina Programável
function placeMine() {
  if (player.mine) {
    const mine = { x: player.x, y: player.y + player.height, width: 10, height: 10 };
    // Add mine to the game (this is just an example, you need to handle it properly in your game logic)
  }
}

// Lâmina Giratória
function applySpinningBlade() {
  if (player.spinningBlade) {
    const blade = { x: player.x, y: player.y, radius: 20 };
    // Add blade to the game (this is just an example, you need to handle it properly in your game logic)
  }
}

// Cura Gradual
function applyGradualHealing() {
  if (player.gradualHealing) {
    const healAmount = 1 * (player.gradualHealing.level || 1); // Increase heal amount with level
    const healInterval = setInterval(() => {
      player.health += healAmount;
      if (!player.gradualHealing) {
        clearInterval(healInterval);
      }
    }, 1000);
  }
}

// Armadilha de Espinhos
function placeSpikeTrap() {
  if (player.spikeTrap) {
    const spikeTrap = { x: player.x, y: player.y + player.height, width: 10, height: 10 };
    // Add spike trap to the game (this is just an example, you need to handle it properly in your game logic)
  }
}

// Corda/Gancho
function useGrapplingHook() {
  if (player.grapplingHook) {
    const distance = 100 * (player.grapplingHook.level || 1); // Increase distance with level
    player.y -= distance;
  }
}

// Elo Espiritual
function useSpiritualLink() {
  if (player.spiritualLink) {
    const enemy = rooms[0].enemies[0]; // Link to the first enemy (this is just an example)
    player.health = enemy.health;
  }
}

// Super Sopro
function useSuperBlow() {
  if (player.superBlow) {
    const distance = 50 * (player.superBlow.level || 1); // Increase distance with level
    rooms.forEach(room => {
      room.enemies.forEach(enemy => {
        enemy.x += distance;
      });
    });
  }
}
