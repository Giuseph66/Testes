document.addEventListener('DOMContentLoaded', () => {
  // Exibe moedas e runas do usuário
  const coinsDisplay = document.getElementById('coinsDisplay');
  const runesDisplay = document.getElementById('runesDisplay');
  let coins = JSON.parse(localStorage.getItem('coins')) || 0;
  let runes = JSON.parse(localStorage.getItem('runes')) || 0;
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
      localStorage.setItem('coins', JSON.stringify(coins));
      coinsDisplay.textContent = "Moedas: " + coins;
      let currentJumps = JSON.parse(localStorage.getItem('extraJumps')) || 1;
      currentJumps += jumpCount;
      localStorage.setItem('extraJumps', JSON.stringify(currentJumps));
      alert("Pulos extras atualizados: " + (currentJumps - 1));
      e.target.reset();
      totalCostDisplay.textContent = "Custo: 0 moedas";
    } else {
      alert("Moedas insuficientes!");
    }
  });

  // Lida com a compra de novas habilidades
  document.getElementById('newAbilityForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const abilityName = document.getElementById('abilityName').value.trim();
    const abilityDescription = document.getElementById('abilityDescription').value.trim();
    const cost = 10; // Defina o custo das habilidades em runas
    if (runes >= cost) {
      runes -= cost;
      localStorage.setItem('runes', JSON.stringify(runes));
      runesDisplay.textContent = "Runas: " + runes;
      let newAbilities = JSON.parse(localStorage.getItem('newAbilities')) || {};
      newAbilities[abilityName] = { description: abilityDescription };
      localStorage.setItem('newAbilities', JSON.stringify(newAbilities));
      alert("Nova habilidade adquirida: " + abilityName);
      e.target.reset();
    } else {
      alert("Runas insuficientes!");
    }
  });

  // Botão para voltar ao menu
  document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = '/';
  });
});
