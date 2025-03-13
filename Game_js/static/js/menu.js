document.addEventListener('DOMContentLoaded', () => {
  let seed = Math.floor(Math.random() * 1000000);
  const seedDisplay = document.getElementById('seedDisplay');
  seedDisplay.value = seed; 
  let tamanho = (String(seed).length * 3.5)+3.5;
  console.log(tamanho);
  seedDisplay.style.width= `${tamanho}%`;
  let coin= localStorage.getItem('coins');
  function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  try{
    if (coin !== null) {
      if (isNumeric(coin)) {
        console.log(coin)
    localStorage.clear()}}
  }catch (e){
    console.log(e)
    localStorage.clear()
  }
  
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

document.getElementById('mendigo').addEventListener('click', () => {
  var modal = document.getElementById('modalOverlay');
  var span = document.getElementsByClassName('close')[0];
  modal.style.display = 'flex';
  span.onclick = function() {
      modal.style.display = 'none'; 
  }
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  }
});

function pix(){
  var modal = document.getElementById('modal');
  const valor = document.getElementById('valor').value;
  fetch('/pix', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(valor)
  })
  .then(response => response.json())
  .then(result => {
      if (result.status === 200 ){
        let div_pix = document.getElementById('pix');
        if (!div_pix){
          div_pix = document.createElement('div');
          div_pix.id = 'pix';
        }
        let imgElement = document.getElementById('qrImage');
        if (!imgElement) {
          imgElement = document.createElement('img');
          imgElement.id = 'qrImage';
        }
        imgElement.src = result.img_url;
        let copia_cola = document.getElementById('copia_cola');
        if (!copia_cola) {
          copia_cola = document.createElement('button');
          copia_cola.className=''
          copia_cola.id = 'copia_cola';
          copia_cola.innerHTML = 'Copiar';
          copia_cola.onclick = function() {
            navigator.clipboard.writeText(result.pqp);
            copia_cola.innerHTML = 'Copiado';
          }
        }
        div_pix.appendChild(imgElement);
        div_pix.appendChild(copia_cola);
        modal.appendChild(div_pix);
      }
    })
    .catch(error => {
      console.error('Erro ao enviar dados:', error);
    
    });

  }
  const zoomRange = document.getElementById('zoomRange');
  const zoomValue = document.getElementById('zoomValue');
  const elemento = document.getElementById('menu');

  zoomRange.addEventListener('input', () => {
    const zoomPercent = zoomRange.value;
    zoomValue.textContent = zoomPercent + '%';
    const scaleValue = zoomPercent / 100;
    elemento.style.transform =  `scale(${scaleValue}) `;
    const translateY = ((100 - zoomPercent) * 3)*-1; // ajuste esse valor conforme necessário
    elemento.style.top=`${translateY}px`;
  });

  function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  if (isMobile()) {
    if (getCookie("visitado")) {
      console.log("Bem-vindo de volta!");
    } else {
      setCookie("visitado", "true", 1); 
      alert("Vire a tela do dispositivo para melhor visualização")
      console.log("Bem-vindo à sua primeira visita!");
    }

    document.getElementById('zoomRange').value = 80;
    adjustZoom();
  }
  
function adjustZoom() {
  const zoomRange = document.getElementById('zoomRange');
  const zoomValue = document.getElementById('zoomValue');
  const elemento = document.getElementById('menu');
  const zoomPercent = zoomRange.value;
  zoomValue.textContent = zoomPercent + '%';
  const scaleValue = zoomPercent / 100;
  elemento.style.transform = 'scale(' + scaleValue + ')';
  const translateY = ((100 - zoomPercent) * 3)*-1; // ajuste esse valor conforme necessário
  elemento.style.top=`${translateY}px`;
}

// Função para obter o valor de um cookie
function getCookie(nome) {
  const nomeEQ = nome + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nomeEQ) === 0) return c.substring(nomeEQ.length, c.length);
  }
  return null;
}

// Função para definir um cookie
function setCookie(nome, valor, dias) {
  let expires = "";
  if (dias) {
    const data = new Date();
    data.setTime(data.getTime() + (dias * 24 * 60 * 60 * 1000));
    expires = "; expires=" + data.toUTCString();
  }
  document.cookie = nome + "=" + (valor || "") + expires + "; path=/";
}

if (getCookie("visitado")) {
  console.log("Bem-vindo de volta!");
} else {
  setCookie("visitado", "true", 365); 
  console.log("Bem-vindo à sua primeira visita!");
}
