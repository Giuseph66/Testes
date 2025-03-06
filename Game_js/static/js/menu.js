document.addEventListener('DOMContentLoaded', () => {
  let seed = Math.floor(Math.random() * 1000000);
  const seedDisplay = document.getElementById('seedDisplay');
  seedDisplay.value = seed; 

  
  const extraJumps = JSON.parse(localStorage.getItem('extraJumps')) || 0;
  document.getElementById('extraJumpsStatus').textContent = "Pulos Extras: " + extraJumps;
  
  // Exibe habilidades customizadas, se houver
  const abilitiesList = document.getElementById('abilitiesList');
  const newAbilities = JSON.parse(localStorage.getItem('abilities')) || {};
  if (!newAbilities) {
    abilitiesList.innerHTML = '';
  }else{
  for (let key in newAbilities) {
    let li = document.createElement('li');
    li.textContent = key + " - " + newAbilities[key].name;
    abilitiesList.appendChild(li);
  }
}
  // Exibe histórico do jogo, se houver
  const historyList = document.getElementById('historyList');
  const gameHistory = JSON.parse(localStorage.getItem('historico')) || [];
  console.log(gameHistory);
  if (gameHistory.length > 0){
    gameHistory.forEach(jogo => {
      console.log(jogo);
      const li = document.createElement('li');
      li.innerHTML = `<b>Seed: ${jogo.seed},</b> <b>MP: ${jogo.distance},</b> <b>Data: ${jogo.momento}</b>`;
      historyList.appendChild(li);
    });
  }
  
  // Exibe moedas e runas
  const coins = JSON.parse(localStorage.getItem('coins')) || 0;
  const runes = JSON.parse(localStorage.getItem('runes')) || 0;
  const sucata = JSON.parse(localStorage.getItem('sucata')) || 0;
  if (coins>0){
    document.getElementById('coinsDisplay').style.display = "block";
    document.getElementById('coinsDisplay').textContent = "Moedas: " + coins;
  }if (runes>0){
    document.getElementById('runesDisplay').style.display = "block";
    document.getElementById('runesDisplay').textContent = "Runas: " + runes;
  }if (sucata>0){
    document.getElementById('sucataDisplay').style.display = "block";
    document.getElementById('sucataDisplay').textContent = "Sucatas: " + sucata;
  }
  
  // Botão para iniciar o jogo
  document.getElementById('startButton').addEventListener('click', () => {
    const seedDisplay = document.getElementById('seedDisplay');
    let seed = seedDisplay.value;
    localStorage.setItem('seed', seed);
    window.location.href = '/game';
  });
});
