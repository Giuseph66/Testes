document.addEventListener('DOMContentLoaded', () => {
    // Gera uma seed aleatória e exibe
    const seed = Math.floor(Math.random() * 1000000);
    document.getElementById('seedDisplay').textContent = seed;
  
    // Armazena a seed no localStorage para que a página do jogo a possa usar
    localStorage.setItem('seed', seed);
  
    // Manipula o formulário de criação de poderes customizados
    document.getElementById('customPowerForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const powerName = document.getElementById('powerName').value.trim();
      const powerDuration = parseInt(document.getElementById('powerDuration').value);
      const powerMultiplier = parseFloat(document.getElementById('powerMultiplier').value);
      const powerColor = document.getElementById('powerColor').value.trim();
  
      if (powerName && powerDuration && powerMultiplier && powerColor) {
        // Salva os poderes customizados em localStorage (em formato JSON)
        let customPowers = JSON.parse(localStorage.getItem('customPowers')) || {};
        customPowers[powerName] = {
          duration: powerDuration,
          coinMultiplier: powerMultiplier,
          color: powerColor
        };
        localStorage.setItem('customPowers', JSON.stringify(customPowers));
        e.target.reset();
        alert("Poder customizado criado: " + powerName);
      }
    });
  
    document.getElementById('startButton').addEventListener('click', () => {
      window.location.href = '/game';
    });
  });
  