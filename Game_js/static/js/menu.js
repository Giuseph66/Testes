document.addEventListener('DOMContentLoaded', () => {
  let seed = Math.floor(Math.random() * 1000000);
  const seedDisplay = document.getElementById('seedDisplay');
  seedDisplay.value = seed; 

  
  const extraJumps = JSON.parse(localStorage.getItem('extraJumps')) || 0;
  document.getElementById('extraJumpsStatus').textContent = "Pulos Extras: " + extraJumps;
  
  // Exibe habilidades customizadas, se houver
  const abilitiesList = document.getElementById('abilitiesList');
  const newAbilities = JSON.parse(localStorage.getItem('newAbilities')) || {};
  for (let key in newAbilities) {
    let li = document.createElement('li');
    li.textContent = key + " - " + newAbilities[key].description;
    abilitiesList.appendChild(li);
  }
  
  // Exibe histórico do jogo, se houver
  const historyList = document.getElementById('historyList');
  const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
  gameHistory.forEach(event => {
    let li = document.createElement('li');
    li.textContent = event;
    historyList.appendChild(li);
  });
  
  // Exibe moedas e runas
  const coins = JSON.parse(localStorage.getItem('coins')) || 0;
  const runes = JSON.parse(localStorage.getItem('runes')) || 0;
  document.getElementById('coinsDisplay').textContent = "Moedas: " + coins;
  document.getElementById('runesDisplay').textContent = "Runas: " + runes;
  
  // Botão para iniciar o jogo
  document.getElementById('startButton').addEventListener('click', () => {
    const seedDisplay = document.getElementById('seedDisplay');
    let seed = seedDisplay.value;
    localStorage.setItem('seed', seed);
    window.location.href = '/game';
  });
  
  // Lida com a criação de poder customizado na página de personalização
  const customPowerForm = document.getElementById('customPowerForm');
  if(customPowerForm){
    customPowerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('powerName').value.trim();
      const duration = parseInt(document.getElementById('powerDuration').value);
      const multiplier = parseFloat(document.getElementById('powerMultiplier').value);
      const color = document.getElementById('powerColor').value.trim();
      if(name && duration && multiplier && color) {
        let customPowers = JSON.parse(localStorage.getItem('customPowers')) || {};
        customPowers[name] = { duration, coinMultiplier: multiplier, color };
        localStorage.setItem('customPowers', JSON.stringify(customPowers));
        alert("Poder customizado criado: " + name);
        customPowerForm.reset();
      }
    });
  }
  
  // Lida com a compra de pulos extras
  const extraJumpForm = document.getElementById('extraJumpForm');
  if(extraJumpForm){
    extraJumpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const jumpCount = parseInt(document.getElementById('jumpCount').value);
      let currentJumps = JSON.parse(localStorage.getItem('extraJumps')) || 0;
      currentJumps += jumpCount;
      localStorage.setItem('extraJumps', JSON.stringify(currentJumps));
      alert("Pulos extras atualizados: " + currentJumps);
      extraJumpForm.reset();
    });
  }
  
  // Lida com a compra de novas habilidades
  const newAbilityForm = document.getElementById('newAbilityForm');
  if(newAbilityForm){
    newAbilityForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const abilityName = document.getElementById('abilityName').value.trim();
      const abilityDescription = document.getElementById('abilityDescription').value.trim();
      let newAbilities = JSON.parse(localStorage.getItem('newAbilities')) || {};
      newAbilities[abilityName] = { description: abilityDescription };
      localStorage.setItem('newAbilities', JSON.stringify(newAbilities));
      alert("Nova habilidade adquirida: " + abilityName);
      newAbilityForm.reset();
    });
  }
});
