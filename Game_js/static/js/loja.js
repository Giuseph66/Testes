document.addEventListener('DOMContentLoaded', () => {
  // Exibe moedas e runas do usuário
  const coinsDisplay = document.getElementById('coinsDisplay');
  const runesDisplay = document.getElementById('runesDisplay');
  let coins = localStorage.getItem('coins') || 0;
  if (coins!=0) {
    const bytes  = CryptoJS.AES.decrypt(coins, "Jesus_Ateu");
    coins = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));}
  let runes = localStorage.getItem('runes') || 0;
  if (runes!=0) {
  const bytes  = CryptoJS.AES.decrypt(runes, "Jesus_Ateu");
  runes = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));}

  coinsDisplay.textContent = "Moedas: " + coins;
  runesDisplay.textContent = "Runas: " + runes;

  // Atualiza o custo total dos pulos extras
  const jumpCountInput = document.getElementById('jumpCount');
  const totalCostDisplay = document.getElementById('totalCost');
  jumpCountInput.addEventListener('input', () => {
    const jumpCount = parseInt(jumpCountInput.value) || 0;
    const cost = 50 * jumpCount;
    totalCostDisplay.textContent = "Custo: " + cost + " moedas";
  });

  // Lida com a compra de pulos extras
  document.getElementById('extraJumpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const jumpCount = parseInt(jumpCountInput.value);
    const cost = 50 * jumpCount; // Defina o custo dos pulos extras
    if (coins >= cost) {
      coins -= cost;
      localStorage.setItem('coins', CryptoJS.AES.encrypt(JSON.stringify(coins), "Jesus_Ateu").toString());
      coinsDisplay.textContent = "Moedas: " + coins;
      let currentJumps = localStorage.getItem('extraJumps') || 1;
      if (currentJumps != 1) {
        const bytes  = CryptoJS.AES.decrypt(currentJumps, "Jesus_Ateu");
        currentJumps =Number(bytes.toString(CryptoJS.enc.Utf8));}
      currentJumps += jumpCount;
      localStorage.setItem('extraJumps', CryptoJS.AES.encrypt(currentJumps.toString(), "Jesus_Ateu").toString());
      alert("Pulos extras atualizados: " + (currentJumps));
      e.target.reset();
      totalCostDisplay.textContent = "Custo: 0 moedas";
    } else {
      alert("Moedas insuficientes!");
    }
  });

  // Função para comprar o máximo possível de pulos extras
  document.getElementById('buyMaxButton').addEventListener('click', () => {
    const maxJumpCount = Math.floor(coins / 50);
    if (maxJumpCount > 0) {
      coins -= maxJumpCount * 50;
      localStorage.setItem('coins', CryptoJS.AES.encrypt(JSON.stringify(coins), "Jesus_Ateu").toString());
      coinsDisplay.textContent = "Moedas: " + coins;
      let currentJumps = localStorage.getItem('extraJumps') || 1;
  if (currentJumps != 1) {
  const bytes  = CryptoJS.AES.decrypt(currentJumps, "Jesus_Ateu");
  currentJumps = Number(bytes.toString(CryptoJS.enc.Utf8));}
      currentJumps += maxJumpCount;
      localStorage.setItem('extraJumps', CryptoJS.AES.encrypt(currentJumps.toString(), "Jesus_Ateu").toString());
      alert("Pulos extras atualizados: " + (currentJumps - 1));
      totalCostDisplay.textContent = "Custo: 0 moedas";
    } else {
      alert("Moedas insuficientes!");
    }
  });

  // Botão para voltar ao menu
  document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = '/';
  });

  // Configuração do livro de poderes
  const leaves = document.querySelectorAll('.leaf');
  const totalLeaves = leaves.length;
  let currentLeaf = 0;

  function ajusta() {
    const book = document.querySelector('.book-container');
    if (book) {
      if (currentLeaf > 0 && currentLeaf < totalLeaves) {
        book.style.left = '15%';
      } else if (currentLeaf === 0) {
        book.style.left = '0';
      } else if (currentLeaf === totalLeaves) {
        book.style.left = '30%';
      }
    } else {
      console.error("Elemento com a classe 'book-container' não foi encontrado.");
    }
  }

  // Define o z-index inicial para cada folha com base em sua ordem (a primeira em cima)
  leaves.forEach((leaf, index) => {
    leaf.style.zIndex = totalLeaves - index;
  });

  // Função para virar a folha para frente (avançar)
  function nextPage(leaf, index, clickX, rect) {
    if (clickX > rect.width * 0.8 && index === currentLeaf) {
      leaf.classList.add('flipped');
      // Após virar, diminui o z-index para que a próxima folha apareça sobre ela
      leaf.style.zIndex = 0;
      currentLeaf++;
      ajusta();
    }
  }

  // Função para voltar a folha (desvirar)
  function prevPage(leaf, index, clickX, rect) {
    if (clickX < rect.width * 0.2 && index === currentLeaf - 1) {
      // Antes de desvirar, restaura o z-index para que a folha volte a ficar no topo
      leaf.style.zIndex = totalLeaves - index;
      leaf.classList.remove('flipped');
      currentLeaf--;
      ajusta();
    }
  }

  // Adiciona os eventos de clique para as páginas de cada folha
  leaves.forEach((leaf, index) => {
    const frontPage = leaf.querySelector('.front');
    const backPage = leaf.querySelector('.back');

    frontPage.addEventListener('click', (e) => {
      const rect = frontPage.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      nextPage(leaf, index, clickX, rect);
    });

    backPage.addEventListener('click', (e) => {
      const rect = backPage.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      prevPage(leaf, index, clickX, rect);
    });
  });
});

function purchaseAbility(abilityName) {
  let runes = localStorage.getItem('runes') || 0;
  if (runes!=0) {
  const bytes  = CryptoJS.AES.decrypt(runes, "Jesus_Ateu");
  runes = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));}
  let purchasedAbilities = localStorage.getItem('abilities') || [];
  if (purchasedAbilities.length > 0) {
  const bytes  = CryptoJS.AES.decrypt(purchasedAbilities, "Jesus_Ateu");
  purchasedAbilities = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));}
  const ability = purchasedAbilities.find(a => a.name === abilityName);
  let cost = 10;

  if (ability) {
    cost = Math.ceil(ability.level * 10 * 1.3);
  }

  if (runes >= cost) {
    runes -= cost;
    localStorage.setItem('runes',  CryptoJS.AES.encrypt(JSON.stringify(runes), "Jesus_Ateu").toString());
    document.getElementById('runesDisplay').textContent = `Runas: ${runes}`;

    if (ability) {
      ability.level++;
    } else {
      purchasedAbilities.push({ name: abilityName, level: 1 });
    }

    localStorage.setItem('abilities', CryptoJS.AES.encrypt(JSON.stringify(purchasedAbilities), "Jesus_Ateu").toString());
    alert(`Habilidade "${abilityName}" comprada com sucesso!`);
    updateUI();
    applyPassiveAbilities();
  } else {
    alert('Runas insuficientes!');
  }
}

function updateUI() {
  const abilitiesUI = document.getElementById('abilitiesUI');
  const activeAbilitiesList = document.getElementById('activeAbilitiesList');
  const powerInfoList = document.getElementById('powerInfoList');
  let purchasedAbilities = localStorage.getItem('abilities') || [];
  if (purchasedAbilities.length > 0) {
  const bytes  = CryptoJS.AES.decrypt(purchasedAbilities, "Jesus_Ateu");
  purchasedAbilities = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));}
  if (purchasedAbilities.length > 0) {
    abilitiesUI.style.display = 'block';
    activeAbilitiesList.innerHTML = '';
    powerInfoList.innerHTML = '';

    purchasedAbilities.forEach(ability => {
      const li = document.createElement('li');
      li.textContent = `${ability.name} (Nível ${ability.level})`;
      activeAbilitiesList.appendChild(li);

      const powerInfoLi = document.createElement('li');
      powerInfoLi.innerHTML = `<strong>${ability.name} (${ability.level})</strong>: ${ability.description} <br> <em>Ativar com a tecla: ${ability.key}</em>`;
      powerInfoList.appendChild(powerInfoLi);
    });
  } else {
    abilitiesUI.style.display = 'none';
  }
}

function applyPassiveAbilities() {
  let purchasedAbilities = localStorage.getItem('abilities') || [];
  if (purchasedAbilities.length > 0) {
  const bytes  = CryptoJS.AES.decrypt(purchasedAbilities, "Jesus_Ateu");
  purchasedAbilities = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));}
  player=[];
  purchasedAbilities.forEach(ability => {
    if (ability.name === 'Teletransporte') {
      ability.key = 'T';
      player.teleport = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Clone Sombrio') {
      ability.key = 'C';
      player.clone = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Controle do Tempo') {
      ability.key = 'Q';
      player.timeControl = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Mundo Invertido') {
      ability.key = 'I';
      player.invertedWorld = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Voar') {
      ability.key = 'F';
      player.canFly = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Raio Laser') {
      ability.key = 'L';
      player.laser = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Escala') {
      ability.key = 'E';
      player.canClimb = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Espectro') {
      ability.key = 'E'; // Se desejar uma tecla diferente, altere aqui
      player.spectralForm = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Espada Sagrada') {
      ability.key = 'S';
      player.sacredSword = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Efeito Bumerangue') {
      ability.key = 'A';
      player.boomerang = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Forma Aquática') {
      ability.key = 'W';
      player.aquaticForm = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Congelamento') {
      ability.key = 'R';
      player.freezing = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Fúria') {
      ability.key = 'U';
      player.fury = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Mina Programável') {
      ability.key = 'M';
      player.mine = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Lâmina Giratória') {
      ability.key = 'P';
      player.spinningBlade = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Cura Gradual') {
      ability.key = 'H';
      player.gradualHealing = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Armadilha de Espinhos') {
      ability.key = 'K';
      player.spikeTrap = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Corda/Gancho') {
      ability.key = 'G';
      player.grapplingHook = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Elo Espiritual') {
      ability.key = 'O';
      player.spiritualLink = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    } else if (ability.name === 'Super Sopro') {
      ability.key = 'B';
      player.superBlow = {id:ability.id, level: ability.level || 1, description: ability.description , key: ability.key };
    }
  });
  displayActiveAbilities();
  displayPowerInfo();
}

function displayActiveAbilities() {
  const activeAbilitiesList = document.getElementById('activeAbilitiesList');
  if (!activeAbilitiesList) {
    return;
  }
  activeAbilitiesList.innerHTML = '';
  let purchasedAbilities = localStorage.getItem('abilities') || [];
  if (purchasedAbilities.length > 0) {
  const bytes  = CryptoJS.AES.decrypt(purchasedAbilities, "Jesus_Ateu");
  purchasedAbilities = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));}
  purchasedAbilities.forEach(ability => {
    const li = document.createElement('li');
    li.textContent = `${ability.name} (Nível ${ability.level})`;
    activeAbilitiesList.appendChild(li);
  });
}

function displayPowerInfo() {
  const powerInfoList = document.getElementById('powerInfoList');
  if (!powerInfoList) {
    return;
  }
  powerInfoList.innerHTML = '';
  let purchasedAbilities = localStorage.getItem('abilities') || [];
  if (purchasedAbilities.length > 0) {
  const bytes  = CryptoJS.AES.decrypt(purchasedAbilities, "Jesus_Ateu");
  purchasedAbilities = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));}
  purchasedAbilities.forEach(ability => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${ability.name} (${ability.level})</strong>: ${ability.description} <br> <em>Ativar com a tecla: ${ability.key}</em>`;
    powerInfoList.appendChild(li);
  });
}