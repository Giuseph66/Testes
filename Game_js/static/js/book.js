document.addEventListener('DOMContentLoaded', () => {
    updateBook();
});

function generateDynamicLeaves(abilities) {
    let sucata = localStorage.getItem('sucata') || 0;
    if (sucata!=0){
    const bytes  = CryptoJS.AES.decrypt(sucata, "Jesus_Ateu");
    sucata = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));}
    if (sucata >0){
      const sucataDisplay = document.createElement('p');
      sucataDisplay.id = 'sucataDisplay';
      sucataDisplay.textContent = `Sucata: ${sucata}`;
      const coinsRunesContainer = document.getElementsByClassName('coins-runes')[0];
      if (coinsRunesContainer) {
        coinsRunesContainer.appendChild(sucataDisplay);
  }
    }
    console.log(sucata);
    const book = document.getElementById('book');
    // Remove folhas dinâmicas anteriores (se houver)
    const prevLeaves = book.querySelectorAll('.leaf.dynamic');
    prevLeaves.forEach(leaf => leaf.remove());
  
    // --- Cria a capa da frente ---
    const frontCover = document.createElement('div');
    frontCover.className = 'leaf dynamic cover front-cover';
    const frontCoverPage = document.createElement('div');
    frontCoverPage.className = 'page front';
    frontCoverPage.innerHTML = '<h1>Livro de poderes</h1>';
    // Você pode deixar a parte de trás da capa da frente vazia
    const frontCoverBackPage = document.createElement('div');
    frontCoverBackPage.className = 'page back';
    frontCoverBackPage.innerHTML = `<h1>Era uma vez...</h1><p>${abilities[0].legend}</p>`;
    frontCover.appendChild(frontCoverPage);
    frontCover.appendChild(frontCoverBackPage);
    book.appendChild(frontCover);
  
    // --- Cria as folhas de habilidades ---
    let purchasedAbilities = localStorage.getItem('abilities') || [];
    if (purchasedAbilities.length > 0){
      console.log(purchasedAbilities);
    const bytes  = CryptoJS.AES.decrypt(purchasedAbilities, "Jesus_Ateu");
    purchasedAbilities = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));}
    let paisagem = localStorage.getItem('paisagem') || 0;
    if (paisagem!=0){
    const bytes  = CryptoJS.AES.decrypt(paisagem, "Jesus_Ateu");
    paisagem = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));}
    abilities.forEach((ability, index) => {
      const purchasedAbility = purchasedAbilities.find(a => a.name === ability.name);
      const level = purchasedAbility ? purchasedAbility.level : 0;
      const cost = Math.ceil(10 * Math.pow(1.3, level));
      
      const leaf = document.createElement('div');
      leaf.className = 'leaf dynamic ability';
      leaf.dataset.leaf = index + 1;
      
      const frontPage = document.createElement('div');
      frontPage.className = 'page front';
      frontPage.innerHTML = `<h1>${ability.name}</h1>
      <p>${ability.description}</p>
        <button onclick="purchaseAbility('${ability.name}', '${ability.description}')" style="margin-top: auto;">
          ${level > 0 ? 'Atualizar' : 'Comprar'} (${cost} Runas)
        </button>`;
      
      const backPage = document.createElement('div');
      backPage.className = 'page back';
      try {
        backPage.innerHTML = `<h1>Era uma vez...</h1><p>${abilities[index+1].legend}</p>`;
      } catch (error) {
        if (sucata>10 || paisagem>0){
          backPage.innerHTML = `<h1>Voce acha tudo feio?</h1><p>Se esforce para melhorar!</p>`;
        }else{
          backPage.innerHTML = `<h1>Era uma vez uma historia que nunca existiu</h1><h1>Mas agora existe</h1><h1>Fim</h1>`;
        }
      }
      leaf.appendChild(frontPage);
      leaf.appendChild(backPage);
      book.appendChild(leaf);
    });
  
    if (sucata>10 || paisagem > 0){
      if (paisagem>0){
        valor=Math.ceil(10 * Math.pow(1.3, paisagem));
      }else{
        valor=10;
      }
    const blackCover = document.createElement('div');
    blackCover.className = 'leaf dynamic cover black-cover';
    const blackCoverPage = document.createElement('div');
    blackCoverPage.className = 'page front';
    blackCoverPage.innerHTML = `<h1>Paisagem</h1>
    <button onclick="comprapaizagem(${valor})" style="margin-top: auto;">${paisagem > 0 ? 'Atualizar' : 'Comprar'} (${valor} Runas e sucatas)</button>`;
    const blackCoverBackPage = document.createElement('div');
    blackCoverBackPage.className = 'page back';
    blackCoverBackPage.innerHTML = `<h1>Era uma vez uma historia que nunca existiu</h1><h1>Mas agora existe</h1><h1>Fim</h1>`;
    blackCover.appendChild(blackCoverPage);
    blackCover.appendChild(blackCoverBackPage);
    book.appendChild(blackCover);
    }
  }

let currentLeaf = 0;
function setupLeafNavigation() {
  const leaves = document.querySelectorAll('.leaf');
  const totalLeaves = leaves.length;

  function ajusta() {
    const bookContainer = document.querySelector('.book-container');
    if (bookContainer) {
      if (currentLeaf > 0 && currentLeaf < totalLeaves) {
        bookContainer.style.left = '150px';
      } else if (currentLeaf === 0) {
        bookContainer.style.left = '0';
      } else if (currentLeaf === totalLeaves) {
        bookContainer.style.left = '300px';
      }
    }
  }

  leaves.forEach((leaf, index) => {
    leaf.style.zIndex = totalLeaves - index;
  });

  function nextPage(leaf, index, clickX, rect) {
    if (clickX > rect.width * 0.8 && index === currentLeaf) {
      leaf.classList.add('flipped');
      leaf.classList.remove('unflipped');
      leaf.style.zIndex = 0;
      currentLeaf++;
      ajusta();
    }
  }

  function prevPage(leaf, index, clickX, rect) {
    if (clickX < rect.width * 0.2 && index === currentLeaf - 1) {
      leaf.style.zIndex = totalLeaves - index;
      leaf.classList.add('unflipped');
      leaf.classList.remove('flipped');
      currentLeaf--;
      ajusta();
    }
  }

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
  ajusta();
}

function purchaseAbility(abilityName, descricao) {
  console.log('Habilidade:', abilityName);
  console.log('Descrição:',descricao);
  let runes = localStorage.getItem('runes') || 0;
  if (runes!=0){
  const bytes  = CryptoJS.AES.decrypt(runes, "Jesus_Ateu");
  runes = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));}
  let purchasedAbilities = localStorage.getItem('abilities') || [];
  if (purchasedAbilities.length > 0){
  const bytes  = CryptoJS.AES.decrypt(purchasedAbilities, "Jesus_Ateu");
  purchasedAbilities = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));}
  const ability = purchasedAbilities.find(a => a.name === abilityName);
  let cost = ability ? Math.ceil(10 * Math.pow(1.3, ability.level)) : 1;
  if (runes >= cost) {
    runes -= cost;
    localStorage.setItem('runes', CryptoJS.AES.encrypt(JSON.stringify(runes), "Jesus_Ateu").toString());
    document.getElementById('runesDisplay').textContent = `Runas: ${runes}`;

    if (ability) {
      ability.level++;
    } else {
      purchasedAbilities.push({ name: abilityName, level: 1 , description:descricao});
    }

    localStorage.setItem('abilities', CryptoJS.AES.encrypt(JSON.stringify(purchasedAbilities), "Jesus_Ateu").toString());
    //alert(`Habilidade "${abilityName}" ${ability ? 'atualizada' : 'comprada'} com sucesso!`);
    applyPassiveAbilities();
    localStorage.setItem('pagination', CryptoJS.AES.encrypt(currentLeaf.toString(), "Jesus_Ateu").toString());
    window.location.reload(); 
  } else {
    alert('Runas insuficientes!');
  }
}
function comprapaizagem(valor) {
  let runes = localStorage.getItem('runes') || 0;
  if (runes!=0){
  const bytes  = CryptoJS.AES.decrypt(runes, "Jesus_Ateu");
  runes = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));}
  let sucata = localStorage.getItem('sucata') || 0;
  if (sucata!=0){
  const bytes  = CryptoJS.AES.decrypt(sucata, "Jesus_Ateu");
  sucata = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));}
  if (runes >= valor && sucata >= valor) {
    runes -= valor;
    sucata -= valor;
    localStorage.setItem('runes', CryptoJS.AES.encrypt(JSON.stringify(runes), "Jesus_Ateu").toString());
    localStorage.setItem('sucata', CryptoJS.AES.encrypt(JSON.stringify(sucata), "Jesus_Ateu").toString());
    localStorage.setItem('pagination', CryptoJS.AES.encrypt(currentLeaf.toString(), "Jesus_Ateu").toString());
    let paisagem = localStorage.getItem('paisagem') || 0;
    if (paisagem!=0){
      const bytes  = CryptoJS.AES.decrypt(paisagem, "Jesus_Ateu");
      paisagem = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));}
      localStorage.setItem('paisagem', CryptoJS.AES.encrypt(JSON.stringify(paisagem+1), "Jesus_Ateu").toString());
    window.location.reload(); 
  }else {
    alert('Runas ou Sucatas insuficientes!');
  }
}

function updateBook() {
  const abilities = [
    { 
        id: 1,
        name: 'Teletransporte', 
        description: 'Permite teletransportar-se para frente.',
        legend: 'Vácuo das Sombras - Dizem que os primeiros nômades aprenderam a dobrar o espaço observando as falhas na escuridão. Quem carrega essa marca pode pisar nas fendas do mundo, mas cuidado: cada salto consome um fragmento da própria sombra.'
    },
    { 
        id: 2,
        name: 'Plataforma Extra', 
        description: 'Cria uma plataforma temporaria.',
        legend: 'Lágrimas da Lua - Cristalizadas pelo choro da deusa Selene ao ser traída pelo Sol, essas estruturas efêmeras são tudo que resta de seu amor condenado. Duram apenas até o primeiro raio de aurora.'
    },
    { 
        id: 3,
        name: 'Controle do Tempo', 
        description: 'Permite controlar o tempo, diminuindo a gravidade.',
        legend: 'Ampulheta de Kronos - Roubada do deus primordial do tempo, a areia dentro dela não cai – flutua. Os grãos são almas de antigos deuses, e quem os comanda paga com anos de sua própria vida.'
    },
    {   
        id: 4,
        name: 'Mundo Invertido', 
        description: 'Inverte a direção do movimento.',
        legend: 'Espelho de Lys - Lys, a trapaceira cósmica, quebrou o reflexo do universo. Este fragmento distorce a lógica, fazendo o pé direito seguir o esquerdo e o céu beijar o chão.'
    },
    {   
        id: 5,
        name: 'Voar', 
        description: 'Permite ao jogador voar por um curto período.',
        legend: 'Penas de Ícaro Renascido - Não são penas, mas cinzas do filho do sol que falhou. Dão asas por 99 batidas, mas ao contrário do mito, é o peso do medo – não da ambição – que derruba o usuário.'
    },
    {   
        id: 6,
        name: 'Raio Laser', 
        description: 'Dispara um raio laser para frente.',
        legend: 'Olho de Dragão - Extraído da criatura que devorou um sol nascente, este cristal prismático concentra luz ancestral. A linha vermelha queima até a alma, mas nunca atinge quem carrega ódio puro.'
    },
    {   
        id: 7,
        name: 'Escala', 
        description: 'Permite ao jogador mudar sua dencidade.',
        legend: 'Um artefato antigo que concede o dom de alterar a densidade. Com ele, é possível tornar-se leve como o vento ou pesado como uma montanha. Dizem que aqueles que o dominam desafiam as leis do mundo, mas poucos conseguem equilibrar seu poder sem se perder.'
    },
    {   
        id: 8,
        name: 'Espectro', 
        description: 'Transforma o jogador em um espectro invencível.',
        legend: 'Véu do Além - Tecido com os últimos suspiros de guerreiros mortos, concede invulnerabilidade... ao custo de sentir todas as dores acumuladas no tecido.'
    },
    {   
        id: 9,
        name: 'Espada Sagrada', 
        description: 'Aumenta o poder de ataque do jogador.',
        legend: 'Lâmina do Juramento Quebrado - Forjada pelo deus da guerra em um dia de trégua, absorve a ambição do portador. Brilha mais forte quando o usuário está prestes a trair seus próprios princípios.'
    },
    {   
        id: 10,
        name: 'Efeito Bumerangue', 
        description: 'Lança um bumerangue que retorna ao jogador.',
        legend: 'Asa do Vendaval - Tallon, o primeiro atirador, fez pacto com os espíritos do vento. Sua arma sempre retorna, mas traz consigo os desejos não ditos de quem estava no caminho.'
    },
    {   
        id: 11,
        name: 'Forma Aquática', 
        description: 'Permite ao jogador nadar rapidamente.',
        legend: 'Escama de Poseídon - Não é um dom, mas uma maldição. Quem a usa se torna parte do oceano – ouvindo chamados das profundezas e esquecendo como respirar em terra firme após muito tempo.'
    },
    {   
        id: 12,
        name: 'Congelamento', 
        description: 'Congela os inimigos ao redor.',
        legend: 'Coração de Jotun - Este fragmento do gigante de gelo preserva seu último ódio. O frio que emana não é físico, mas o vazio deixado por amor não correspondido há eras.'
    },
    {   
        id: 13,
        name: 'Fúria', 
        description: 'Aumenta a velocidade e o poder de ataque do jogador.',
        legend: 'Runas Berseker - Marcadas na carne pelo deus da guerra, transformam dor em poder. Mas cada uso apaga uma memória feliz, deixando apenas o gosto de metal e o cheiro de cinzas.'
    },
    {   
        id: 14,
        name: 'Mina Programável', 
        description: 'Coloca uma mina no chão que explode ao contato.',
        legend: 'Semente do Caos - Criada por anões alquimistas loucos, contém fúria líquida. Reconhece o toque do dono, mas exige sacrifícios periódicos de metais preciosos para não se voltar contra ele.'
    },
    {   
        id: 15,
        name: 'Lâmina Giratória', 
        description: 'Cria uma lâmina giratória ao redor do jogador.',
        legend: 'Anel de Vulcan - O deus ferreiro forjou esta serpente de aço vivo para sua amada Vênus. Gira eternamente, cortando tudo exceto a verdadeira paixão – e dedos hesitantes.'
    },
    {   
        id: 16,
        name: 'Cura Gradual', 
        description: 'Regenera a saúde do jogador gradualmente.',
        legend: 'Seiva da Árvore do Crepúsculo - A última raiz da árvore que ligava mundos. Cura feridas, mas com cada uso, plantas estranhas brotam no local – algumas com espinhos, outras com olhos...'
    },
    {   
        id: 17,
        name: 'Armadilha de Espinhos', 
        description: 'Coloca uma armadilha de espinhos no chão.',
        legend: 'Sussurro da Floresta - Sementes colhidas onde o sangue de Pan secou. Crescem rápido demais, alimentando-se de raiva. Dizem que ainda se ouvem risadas quando alguém é impalado.'
    },
    {   
        id: 18,
        name: 'Corda/Gancho', 
        description: 'Permite ao jogador usar um gancho para se mover rapidamente.',
        legend: 'Tendão do Tecedor - A deusa aranha ofereceu seu próprio fio em troca de companhia. A corda nunca quebra, mas deixa marcas de quelíceras nas mãos e puxa para direções desconhecidas.'
    },
    {   
        id: 19,
        name: 'Elo Espiritual', 
        description: 'Conecta a saúde do jogador à de um inimigo.',
        legend: 'Laço de Lillith - A primeira feiticeira amarrou almas usando seu próprio cabelo. O vínculo transfere vida, mas também memórias – e às vezes, a vontade do inimigo.'
    },
    {   
        id: 20,
        name: 'Super Sopro', 
        description: 'Empurra os inimigos para longe.',
        legend: 'Fôlego de Typhon - Engarrafado durante a batalha contra Zeus, contém o furacão primordial. Quem o libera deve gritar uma verdade dolorosa – mentiras apagam o efeito.'
    }
];
  generateDynamicLeaves(abilities);
  setupLeafNavigation(); 
  let pagination = localStorage.getItem('pagination') || 0;
  if (pagination!=0){
  const bytes  = CryptoJS.AES.decrypt(pagination, "Jesus_Ateu");
  pagination = Number(bytes.toString(CryptoJS.enc.Utf8));}
  if (pagination > 0) {
    goToPage(pagination);
  }
}

function goToPage(targetLeaf) {
  const leaves = document.querySelectorAll('.leaf');
  const totalLeaves = leaves.length;
  
  // Limita targetLeaf para valores válidos
  if (targetLeaf < 0) targetLeaf = 0;
  if (targetLeaf > totalLeaves) targetLeaf = totalLeaves;
  
  // Para cada folha, se o índice for menor que targetLeaf, ela deve estar virada (flipped)
  // Caso contrário, ela deve estar normal
  leaves.forEach((leaf, index) => {
    if (index < targetLeaf) {
      leaf.classList.add('flipped');
      leaf.classList.remove('unflipped');
      leaf.style.zIndex = 0; 
    } else {
      leaf.classList.add('unflipped');
      leaf.classList.remove('flipped');
      leaf.style.zIndex = totalLeaves - index;
    }
  });
  
  // Atualiza a variável global com o valor atual
  currentLeaf = targetLeaf;
  
  // Ajusta a posição do container (por exemplo, alterando o left) conforme o valor
  const bookContainer = document.querySelector('.book-container');
  if (bookContainer) {
    if (targetLeaf > 0 && targetLeaf < totalLeaves) {
      bookContainer.style.left = '150px';
    } else if (targetLeaf === 0) {
      bookContainer.style.left = '0';
    } else if (targetLeaf === totalLeaves) {
      bookContainer.style.left = '300px';
    }
  }
  
  console.log("Indo para a página (folha):", targetLeaf);
}