// Teletransporte
function useTeletransporte() {
  if (activePowers['teletransporte'] > 0) {
    // Implement teleport logic here
    alert("Teletransporte ativado!");
    player.x += 100; // Example: move player 100 units to the right
    activePowers['teletransporte']--;
  }
}

// Clone Sombrio
function createClone() {
  if (activePowers['cloneSombrio'] > 0) {
    // Implement clone creation logic here
    // Example: create a clone at the player's position
    const clone = { ...player, x: player.x + 50 }; // Clone appears 50 units to the right
    // Add clone to the game (this is just an example, you need to handle it properly in your game logic)
    activePowers['cloneSombrio']--;
  }
}

// Controle do Tempo
function applyTimeControl() {
  if (activePowers['controleDoTempo'] > 0) {
    // Implement time control logic here
    // Example: slow down time
    GRAVITY = 0.1; // Reduce gravity to slow down the game
    setTimeout(() => { GRAVITY = 0.3; }, 5000); // Restore gravity after 5 seconds
    activePowers['controleDoTempo']--;
  }
}

// Mundo Invertido
function applyInvertedWorld() {
  if (activePowers['mundoInvertido'] > 0) {
    // Implement inverted world logic here
    // Example: invert the player's controls
    player.speed = -player.speed;
    setTimeout(() => { player.speed = -player.speed; }, 5000); // Restore controls after 5 seconds
    activePowers['mundoInvertido']--;
  }
}

// Voar
function applyFlying() {
  if (activePowers['voar'] > 0) {
    // Implement flying logic here
    // Example: allow the player to fly
    player.velocityY = -5; // Move the player upwards
    setTimeout(() => { player.velocityY = 0; }, 5000); // Stop flying after 5 seconds
    activePowers['voar']--;
  }
}

// Raio Laser
function shootLaser() {
  if (activePowers['raioLaser'] > 0) {
    // Implement laser shooting logic here
    // Example: shoot a laser beam
    const laser = { x: player.x + player.width, y: player.y + player.height / 2, width: 10, height: 2 };
    // Add laser to the game (this is just an example, you need to handle it properly in your game logic)
    activePowers['raioLaser']--;
  }
}

// Escalada
function applyClimbing() {
  if (activePowers['escalada'] > 0) {
    // Implement climbing logic here
    // Example: allow the player to climb walls
    player.velocityY = -5; // Move the player upwards
    setTimeout(() => { player.velocityY = 0; }, 5000); // Stop climbing after 5 seconds
    activePowers['escalada']--;
  }
}

// Espectro
function applySpectralForm() {
  if (activePowers['espectro'] > 0) {
    // Implement spectral form logic here
    // Example: make the player invincible
    player.invincible = true;
    setTimeout(() => { player.invincible = false; }, 5000); // Remove invincibility after 5 seconds
    activePowers['espectro']--;
  }
}

// Espada Sagrada
function applySacredSword() {
  if (activePowers['espadaSagrada'] > 0) {
    // Implement sacred sword logic here
    // Example: increase player's attack power
    player.attackPower = 2; // Double the attack power
    setTimeout(() => { player.attackPower = 1; }, 5000); // Restore attack power after 5 seconds
    activePowers['espadaSagrada']--;
  }
}

// Efeito Bumerangue
function applyBoomerangEffect() {
  if (activePowers['bumerangue'] > 0) {
    // Implement boomerang effect logic here
    // Example: throw a boomerang
    const boomerang = { x: player.x + player.width, y: player.y + player.height / 2, width: 10, height: 2 };
    // Add boomerang to the game (this is just an example, you need to handle it properly in your game logic)
    activePowers['bumerangue']--;
  }
}

// Forma Aquática
function applyAquaticForm() {
  if (activePowers['formaAquatica'] > 0) {
    // Implement aquatic form logic here
    // Example: allow the player to swim
    player.velocityY = -2; // Move the player upwards slowly
    setTimeout(() => { player.velocityY = 0; }, 5000); // Stop swimming after 5 seconds
    activePowers['formaAquatica']--;
  }
}

// Congelamento
function applyFreezing() {
  if (activePowers['congelamento'] > 0) {
    // Implement freezing logic here
    // Example: freeze enemies
    rooms.forEach(room => {
      room.enemies.forEach(enemy => {
        enemy.frozen = true;
        setTimeout(() => { enemy.frozen = false; }, 5000); // Unfreeze enemies after 5 seconds
      });
    });
    activePowers['congelamento']--;
  }
}

// Fúria
function applyFury() {
  if (activePowers['furia'] > 0) {
    // Implement fury logic here
    // Example: increase player's speed and attack power
    player.speed *= 2;
    player.attackPower = 2;
    setTimeout(() => {
      player.speed /= 2;
      player.attackPower = 1;
    }, 5000); // Restore speed and attack power after 5 seconds
    activePowers['furia']--;
  }
}

// Mina Programável
function placeMine() {
  if (activePowers['mina'] > 0) {
    // Implement mine placement logic here
    const mine = { x: player.x, y: player.y + player.height, width: 10, height: 10 };
    // Add mine to the game (this is just an example, you need to handle it properly in your game logic)
    activePowers['mina']--;
  }
}

// Lâmina Giratória
function applySpinningBlade() {
  if (activePowers['laminaGiratoria'] > 0) {
    // Implement spinning blade logic here
    // Example: create a spinning blade around the player
    const blade = { x: player.x, y: player.y, radius: 20 };
    // Add blade to the game (this is just an example, you need to handle it properly in your game logic)
    activePowers['laminaGiratoria']--;
  }
}

// Cura Gradual
function applyGradualHealing() {
  if (activePowers['curaGradual'] > 0) {
    // Implement gradual healing logic here
    // Example: gradually heal the player
    const healInterval = setInterval(() => {
      player.health += 1;
      if (activePowers['curaGradual'] <= 0) {
        clearInterval(healInterval);
      }
    }, 1000); // Heal 1 health point every second
    activePowers['curaGradual']--;
  }
}

// Armadilha de Espinhos
function placeSpikeTrap() {
  if (activePowers['armadilhaEspinhos'] > 0) {
    // Implement spike trap placement logic here
    const spikeTrap = { x: player.x, y: player.y + player.height, width: 10, height: 10 };
    // Add spike trap to the game (this is just an example, you need to handle it properly in your game logic)
    activePowers['armadilhaEspinhos']--;
  }
}

// Corda/Gancho
function useGrapplingHook() {
  if (activePowers['gancho'] > 0) {
    // Implement grappling hook logic here
    // Example: move the player to a higher position
    player.y -= 100; // Move the player 100 units upwards
    activePowers['gancho']--;
  }
}

// Elo Espiritual
function useSpiritualLink() {
  if (activePowers['eloEspiritual'] > 0) {
    // Implement spiritual link logic here
    // Example: link the player's health to an enemy's health
    const enemy = rooms[0].enemies[0]; // Link to the first enemy (this is just an example)
    player.health = enemy.health;
    activePowers['eloEspiritual']--;
  }
}

// Super Sopro
function useSuperBlow() {
  if (activePowers['superSopro'] > 0) {
    // Implement super blow logic here
    // Example: push enemies away from the player
    rooms.forEach(room => {
      room.enemies.forEach(enemy => {
        enemy.x += 50; // Push the enemy 50 units to the right
      });
    });
    activePowers['superSopro']--;
  }
}
