const seed = localStorage.getItem('seed') || 0;
let nome = localStorage.getItem('nome') || "";
if (nome != "") {
  const bytes = CryptoJS.AES.decrypt(nome, "Jesus_Ateu");
  nome = bytes.toString(CryptoJS.enc.Utf8);
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
  console.log(historicoExistente);
  localStorage.setItem('historico', CryptoJS.AES.encrypt(JSON.stringify(historicoExistente), "Jesus_Ateu").toString());

});
let passiveAbilities = localStorage.getItem('abilities') || [];
if (passiveAbilities.length > 0) {
  const bytes = CryptoJS.AES.decrypt(passiveAbilities, "Jesus_Ateu");
  passiveAbilities = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

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
const dados = {
  nome: nome,
  distance: distance,
  tempo: demorou,
  coins: coins,
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
  nome = document.getElementById('nome').value;
  if (nome == '') {
    document.getElementById('nome').style.border = '2px solid red';
    document.getElementById('nome').style.boxShadow = '5px solid red';
    document.getElementById('avisanome').textContent = "❌";
    return;
  }
  dados.nome = nome;
  localStorage.setItem('nome', CryptoJS.AES.encrypt((nome).toString(), "Jesus_Ateu").toString());
  
 
  
  console.log(dados);
  fetch('/receber_dados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.status);
        if (result.status === 200 ){
          document.getElementById('avisanome').textContent = "✅";
          document.getElementById('nome').style.border = '2px solid green';
          document.getElementById('nome').style.boxShadow = '5px solid green';
        }else{
          document.getElementById('avisanome').textContent = "❌";
          document.getElementById('nome').style.border = '2px solid red';
          document.getElementById('nome').style.boxShadow = '5px solid red';
        }
        console.log('Dados enviados com sucesso:', result);
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  }


function voltarMenu() {
  enviarDados();
  window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('reset').focus();
});