const seed = localStorage.getItem('seed') || 0;
let nome = localStorage.getItem('nome') || "";
if (nome != "") {
  const bytes = CryptoJS.AES.decrypt(nome, "Jesus_Ateu");
  nome = bytes.toString(CryptoJS.enc.Utf8);
}
let senha = localStorage.getItem('senha') || "";
if (senha != "") {
  const bytes = CryptoJS.AES.decrypt(senha, "Jesus_Ateu");
  senha = bytes.toString(CryptoJS.enc.Utf8);
}
let distance = localStorage.getItem('distanceTraveled') || 0;
if (distance != 0) {
  const bytes = CryptoJS.AES.decrypt(distance, "Jesus_Ateu");
  distance = bytes.toString(CryptoJS.enc.Utf8);
}
let demorou = localStorage.getItem('demorou') || 0;
if (demorou != 0) {
  const bytes = CryptoJS.AES.decrypt(demorou, "Jesus_Ateu");
  demorou = bytes.toString(CryptoJS.enc.Utf8);
}
const momento = new Date().toLocaleString();
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('nome').value = nome;
  document.getElementById('senha').value = senha;
  let coins_ = localStorage.getItem('coinsEarned') || 0;
  if (coins_ != 0) {
    const bytes = CryptoJS.AES.decrypt(coins_, "Jesus_Ateu");
    coins_ = bytes.toString(CryptoJS.enc.Utf8);
  }
  let historicoExistente = localStorage.getItem('historico') || [];
  if (historicoExistente.length > 0) {
    const bytes = CryptoJS.AES.decrypt(historicoExistente, "Jesus_Ateu");
    historicoExistente = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  document.getElementById('distance').textContent = distance + " MP";
  document.getElementById('coins').textContent = coins_;
  historicoExistente.push({ distance, momento, seed });  
  historicoExistente.sort((a, b) => a.distance - b.distance);
  if (historicoExistente.length > 100) {
  historicoExistente.shift();
  }
  localStorage.setItem('historico', CryptoJS.AES.encrypt(JSON.stringify(historicoExistente), "Jesus_Ateu").toString());

});
let passiveAbilities = localStorage.getItem('abilities') || [];
if (passiveAbilities.length > 0) {
  const bytes = CryptoJS.AES.decrypt(passiveAbilities, "Jesus_Ateu");
  passiveAbilities = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

let pulo =localStorage.getItem('extraJumps') || 1;
if (pulo!=1){
const bytes  = CryptoJS.AES.decrypt(pulo, "Jesus_Ateu");
pulo =Number(bytes.toString(CryptoJS.enc.Utf8));}
let coins = localStorage.getItem('coins') || 0;
if (coins != 0) {
  const bytes = CryptoJS.AES.decrypt(coins, "Jesus_Ateu");
  coins = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
let runes = localStorage.getItem('runes') || 0;
if (runes != 0) {
  const bytes = CryptoJS.AES.decrypt(runes, "Jesus_Ateu");
  runes = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
let sucata = localStorage.getItem('sucata') || 0;
if (sucata != 0) {
  const bytes = CryptoJS.AES.decrypt(sucata, "Jesus_Ateu");
  sucata = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
let backup = localStorage.getItem('backup') || "{}";
if (backup.length > 0) {
  try {
    const bytes = CryptoJS.AES.decrypt(backup, "Jesus_Ateu");
    backup = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    console.error("Erro ao descriptografar backup:", e);
    backup = {};
  }
}

let historico = localStorage.getItem('historico') || [];
  if (historico.length > 0) {
    const bytes = CryptoJS.AES.decrypt(historico, "Jesus_Ateu");
    historico = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  
const dados = {
  nome: nome,
  senha:senha,
  distance: distance,
  tempo: demorou,
  backup: backup,
  momento: momento,
  seed: seed,
  ip: "Nao suportado",
  abilidades: passiveAbilities,
  pontos: { coins: coins, sucata: sucata, runes: runes }
}
fetch('https://api.ipify.org?format=json')
.then(response => response.json())
.then(data => {
  dados.ip = data.ip;
})
.catch(error => {
  console.error("Erro ao obter IP:", error);
});
function enviarDados() {
  let backup = localStorage.getItem('backup') || [];
if (backup.length > 0) {
  try {
    const bytes = CryptoJS.AES.decrypt(backup, "Jesus_Ateu");
    backup = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    console.error("Erro ao descriptografar backup:", e);
    backup = {};
  }
}
  nome = document.getElementById('nome').value;
  nome = nome.toUpperCase();
  senha = document.getElementById('senha').value;
  try {
    if (backup.altorizar == true && (backup.nome != nome || backup.senha != senha)) {
      backup.altorizar = false;
    }
  } catch {
    console.log("Primeira vez");
  }
  
backup={
  nome: nome,
  senha:senha,
  coins: coins,
  runes: runes,
  sucata: sucata,
  pulos: pulo,
  historico: historico,
  passiveAbilities: passiveAbilities,
  altorizar: backup.altorizar || false,
}
dados.backup=backup;
localStorage.setItem('backup', CryptoJS.AES.encrypt(JSON.stringify(backup), "Jesus_Ateu").toString());

  if (nome == '') {
    document.getElementById('nome').style.border = '2px solid red';
    document.getElementById('nome').style.boxShadow = '5px solid red';
    document.getElementById('avisanome').textContent = "❌";
    return;
  }else if (senha == ''){
    document.getElementById('senha').style.border = '2px solid red';
    document.getElementById('senha').style.boxShadow = '5px solid red';
    document.getElementById('avisanome').textContent = "❌";
  }
  dados.nome = nome;
  dados.senha = senha;
  localStorage.setItem('nome', CryptoJS.AES.encrypt((nome).toString(), "Jesus_Ateu").toString());
  localStorage.setItem('senha', CryptoJS.AES.encrypt((senha).toString(), "Jesus_Ateu").toString());
  
 
  
  return fetch('/receber_dados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 200 ){
          document.getElementById('avisanome').textContent = "✅";
          document.getElementById('nome').style.border = '2px solid green';
          document.getElementById('nome').style.boxShadow = '5px solid green';
          document.getElementById('senha').style.border = '2px solid green';
          document.getElementById('senha').style.boxShadow = '5px solid green';
        }else if (result.status ===300){
          document.getElementById('nome').style.border = '2px solid green';
          document.getElementById('nome').style.boxShadow = '5px solid green';
          document.getElementById('senha').style.border = '2px solid red';
          document.getElementById('senha').style.boxShadow = '5px solid red';
          document.getElementById('avisanome').textContent = "❌";
        }else if(result.status === 999){
          abrirmodal(result.mensagem);
        }else{
          document.getElementById('nome').style.border = '2px solid red';
          document.getElementById('nome').style.boxShadow = '5px solid red';
          document.getElementById('senha').style.border = '2px solid red';
          document.getElementById('senha').style.boxShadow = '5px solid red';
          document.getElementById('avisanome').textContent = "❌";
        }
        return result;
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
        return result;
      });
  }


  function voltarMenu() {
  enviarDados();
  window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('reset').focus();
});

function abrirmodal(restalrar) {
  if (typeof restalrar === 'string') {
  restalrar = JSON.parse(restalrar);
  }
  const modalOverlay = document.getElementById('modalOverlay');
  modalOverlay.style.display = 'flex';
  
  document.getElementById('modalNoButton').addEventListener('click', () => {
    modalOverlay.style.display = 'none';
    nome = document.getElementById('nome').value;
    nome = nome.toUpperCase();
    senha = document.getElementById('senha').value;
    backup.altorizar= true;
    backup.nome = nome;
    backup.senha = senha;
    localStorage.setItem('backup', CryptoJS.AES.encrypt(JSON.stringify(backup), "Jesus_Ateu").toString());
    enviarDados()
  });
  
  document.getElementById('modalYesButton').addEventListener('click', () => {
    
    modalOverlay.style.display = 'none';
    nome = document.getElementById('nome').value;
    nome = nome.toUpperCase();
    senha = document.getElementById('senha').value;
    backup.altorizar= true;
    backup.nome = nome;
    backup.senha = senha;
    localStorage.setItem('backup', CryptoJS.AES.encrypt(JSON.stringify(backup), "Jesus_Ateu").toString());
    localStorage.setItem('extraJumps',CryptoJS.AES.encrypt(JSON.stringify(restalrar.pulos), "Jesus_Ateu").toString());
    localStorage.setItem('sucata', CryptoJS.AES.encrypt(JSON.stringify(restalrar.sucata), "Jesus_Ateu").toString());
    localStorage.setItem('runes', CryptoJS.AES.encrypt(JSON.stringify(restalrar.runes), "Jesus_Ateu").toString());
    localStorage.setItem('coins',CryptoJS.AES.encrypt(JSON.stringify(restalrar.coins), "Jesus_Ateu").toString());
    localStorage.setItem('abilities', CryptoJS.AES.encrypt(JSON.stringify(restalrar.passiveAbilities), "Jesus_Ateu").toString());
    localStorage.setItem('historico', CryptoJS.AES.encrypt(JSON.stringify(restalrar.historico), "Jesus_Ateu").toString());
    enviarDados()
  });
}