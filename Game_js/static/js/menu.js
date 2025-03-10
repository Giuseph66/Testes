document.addEventListener('DOMContentLoaded', () => {
  let seed = Math.floor(Math.random() * 1000000);
  const seedDisplay = document.getElementById('seedDisplay');
  seedDisplay.value = seed; 
  let tamanho = (String(seed).length * 3.5)+3.5;
  console.log(tamanho);
  seedDisplay.style.width= `${tamanho}%`;

  
  let extraJumps = localStorage.getItem('extraJumps') || 0;
  if (extraJumps!=0){
    const bytes  = CryptoJS.AES.decrypt(extraJumps, "Jesus_Ateu");
    extraJumps = Number(bytes.toString(CryptoJS.enc.Utf8));}
  document.getElementById('extraJumpsStatus').textContent = "Pulos Extras: " + extraJumps;
  
  // Exibe habilidades customizadas, se houver
  const abilitiesList = document.getElementById('abilitiesList');
  let newAbilities = localStorage.getItem('abilities') || [];
  if (newAbilities.length>0){
    const bytes  = CryptoJS.AES.decrypt(newAbilities, "Jesus_Ateu");
    newAbilities = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    for (let key in newAbilities) {
      let li = document.createElement('li');
      li.textContent = key + " - " + newAbilities[key].name;
      abilitiesList.appendChild(li);
    }
    }else{
    abilitiesList.innerHTML = '';
}
  // Exibe histórico do jogo, se houver
  const historyList = document.getElementById('historyList');
  let gameHistory = localStorage.getItem('historico') || [];
  if (gameHistory.length > 0){
    const bytes  = CryptoJS.AES.decrypt(gameHistory, "Jesus_Ateu");
    gameHistory = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    gameHistory.sort((a, b) => b.distance-a.distance);
    gameHistory.forEach(jogo => {
      //console.log(jogo);
      const li = document.createElement('li');
      li.innerHTML = `<b>Seed: ${jogo.seed},</b> <b>MP: ${jogo.distance},</b> <b>Data: ${jogo.momento}</b>`;
      historyList.appendChild(li);
    });
  }
  
  // Exibe moedas e runas
  let coins = localStorage.getItem('coins') || 0;
  if (coins!=0){
  let bytes  = CryptoJS.AES.decrypt(coins, "Jesus_Ateu");
  coins = bytes.toString(CryptoJS.enc.Utf8);}
  let runes = localStorage.getItem('runes') || 0;
  if (runes!=0){
  let bytes  = CryptoJS.AES.decrypt(runes, "Jesus_Ateu");
  runes = bytes.toString(CryptoJS.enc.Utf8);}
  let sucata = localStorage.getItem('sucata') || 0;
  if (sucata!=0){
  let bytes  = CryptoJS.AES.decrypt(sucata, "Jesus_Ateu");
  sucata = bytes.toString(CryptoJS.enc.Utf8);}
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
document.getElementById('recordsChanged').addEventListener('click', () => {
  window.location.href = '/records';
});
