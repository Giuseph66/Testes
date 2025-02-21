function limpar() {
    const container = document.getElementById('qa-container')
    if (container) {
      container.innerHTML = '';
      document.getElementById('json-output').innerHTML = '';
    }
    updateCount()
  }
  function toggleInput(textarea, arrow) {
    if (textarea.classList.contains('expanded')) {
      textarea.classList.remove('expanded')
      textarea.style.height = textarea.dataset.collapsedHeight || '24px'
      arrow.textContent = '▼'
    } else {
      if (!textarea.dataset.collapsedHeight) {
        textarea.dataset.collapsedHeight = textarea.offsetHeight + 'px'
      }
      textarea.classList.add('expanded')
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
      arrow.textContent = '▲'
    }
  }
  
  function addQAPair(pergunta = '', resposta = '') {
    const container = document.getElementById('qa-container')
    const pairDiv = document.createElement('div')
    pairDiv.className = 'qa-pair'
  
    const questionContainer = document.createElement('div')
    questionContainer.className = 'textarea-container'
    const textareaPergunta = document.createElement('textarea')
    textareaPergunta.className = 'question'
    textareaPergunta.placeholder = 'Pergunta: <human>:'
    textareaPergunta.value = pergunta
    const toggleArrowQ = document.createElement('span')
    toggleArrowQ.className = 'toggle-arrow'
    toggleArrowQ.textContent = '▼'
    toggleArrowQ.onclick = function () {
      toggleInput(textareaPergunta, toggleArrowQ)
    }
    questionContainer.appendChild(textareaPergunta)
    questionContainer.appendChild(toggleArrowQ)
  
    // Container e campo para a resposta
    const answerContainer = document.createElement('div')
    answerContainer.className = 'textarea-container'
    const textareaResposta = document.createElement('textarea')
    textareaResposta.className = 'answer'
    textareaResposta.placeholder = 'Resposta: <bot>:'
    textareaResposta.value = resposta
    const toggleArrowA = document.createElement('span')
    toggleArrowA.className = 'toggle-arrow'
    toggleArrowA.textContent = '▼'
    toggleArrowA.onclick = function () {
      toggleInput(textareaResposta, toggleArrowA)
    }
    answerContainer.appendChild(textareaResposta)
    answerContainer.appendChild(toggleArrowA)
  
    // Botão para remover o par
    const removeBtn = document.createElement('button')
    removeBtn.className = 'remove-btn'
    removeBtn.textContent = 'Remover'
    removeBtn.onclick = function () {
      container.removeChild(pairDiv)
      updateCount()
    }
  
    pairDiv.appendChild(questionContainer)
    pairDiv.appendChild(answerContainer)
    pairDiv.appendChild(removeBtn)
    container.appendChild(pairDiv)
    updateCount()
  }
  
  // Atualiza a contagem de pares
  function updateCount() {
    const qaPairs = document.querySelectorAll('.qa-pair')
    document.getElementById('contagem').textContent = 'Contagem de Perguntas e Respostas: ' + qaPairs.length
  }
  
  // Adicionar novo par ao clicar no botão
  document.getElementById('add-btn').addEventListener('click', () => {
    addQAPair()
  })
  
  document.getElementById('file-input').addEventListener('change', function () {
    if (this.files.length === 0) {
      alert('Selecione um arquivo JSON primeiro.');
      return;
    }
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const qaContainer = document.getElementById('qa-container');
        qaContainer.innerHTML = '';
        data.forEach((item) => {
          let text = item.text;
          let lower = text.toLowerCase();
          let question = '', answer = '';
          if (lower.includes("<pergunta>:") && lower.includes("<resposta>:")) {
            question = text.split(/<resposta>:/i)[0].replace(/<pergunta>:/i, '').trim();
            answer = text.split(/<resposta>:/i)[1].trim();
          } else if (lower.includes("<usuario>:") && lower.includes("<bot>:")) {
            question = text.split(/<bot>:/i)[0].replace(/<usuario>:/i, '').trim();
            answer = text.split(/<bot>:/i)[1].trim();
          } else if (lower.includes("<humano>:") && lower.includes("<bot>:")) {
            question = text.split(/<bot>:/i)[0].replace(/<humano>:/i, '').trim();
            answer = text.split(/<bot>:/i)[1].trim();
          } else {
            question = text.trim();
            answer = '';
          }
          addQAPair(question, answer);
        });
      } catch (err) {
        alert('Erro ao ler o arquivo JSON: ' + err);
      }
    };
    reader.readAsText(file);
  });
  
  
  // Exportar o conteúdo atual para JSON no formato desejado e preparar o download
  document.getElementById('export-btn').addEventListener('click', () => {
    const qaPairs = document.querySelectorAll('.qa-pair')
    const result = []
  
    qaPairs.forEach((pair) => {
      const pergunta = pair.querySelector('.question').value
      const resposta = pair.querySelector('.answer').value
      const text = `<human>: ${pergunta}\n<bot>: ${resposta}`
      result.push({
        text: text
      })
    })
  
    // Formata o JSON com identação
    const jsonOutput = JSON.stringify(result, null, 4)
    document.getElementById('json-output').textContent = jsonOutput
  
    // Cria um blob e gera um link para download
    const blob = new Blob([jsonOutput], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const downloadLink = document.getElementById('download-btn')
    downloadLink.href = url
    downloadLink.download = 'data.json'
    downloadLink.style.display = 'inline-block'
  })

  const openModal = document.getElementById('abrir_modal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
openModal.addEventListener('click', () => {
  modalOverlay.style.display = 'flex';
});
modalClose.addEventListener('click', () => {
  modalOverlay.style.display = 'none';
});
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = 'none';
  }
});