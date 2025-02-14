let pollTimer = null;
    let lastIndex = 0;
    let currentContato = '';
    let loadingInterval;
    let count = 0;
    let leaderLineInstance;
    function showLoading() {
      const container = document.getElementById('loadingContainer');
      container.style.display = 'block';
      count = 0;
      document.getElementById('counter').textContent = count;
      loadingInterval = setInterval(() => {
        count++;
        document.getElementById('counter').textContent = count;
      }, 1000);
    }
    function hideLoading() {
      const container = document.getElementById('loadingContainer');
      container.style.display = 'none';
      clearInterval(loadingInterval);
    }
    function sendMessage() {
      const csrftoken = getCookie('csrftoken');
      const input = document.getElementById("messageInput");
      const message = input.value.trim();
      const contato = document.getElementById("chatLabel").innerText;
      if (message) {
        const messagesDiv = document.getElementById("messages");
        const userMessage = document.createElement("div");
        const modelo = document.getElementById("modelo").value;
        const personalidade = document.getElementById("personalidade_input").value;

        showLoading();
        fetch(`/mensagem`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
          },
          body: JSON.stringify({
            mesagem: message,
            contato: contato,
            modelo: modelo,
            personalidade: personalidade
          })
        })
          .then(response => {
            if (response.status === 200) {
              console.log("response retornados:", response);
              console.log("Mensagem enviada com sucesso!");
              return response.json();
            } else {
              throw new Error("Erro ao enviar mensagem. Status: " + response.status);
            }
          })
          .then(data => {
            console.log("Dados retornados:", data);
            if (data.doc && data.doc.pessoa === "bot") {
              hideLoading();
              loadChat(contato);
            }
          })
          .catch(error => {
            console.error("Erro:", error);
          });


        //userMessage.classList.add("message", "user");
        //userMessage.textContent = message;
        //messagesDiv.appendChild(userMessage);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        input.value = "";
      }
    }

    document.getElementById('messageInput').addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        sendMessage();
      }
    });

    function pollChat(contato) {
      const url = `/chat/${encodeURIComponent(contato)}`;
      document.getElementById("chatLabel").textContent = contato;

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao carregar os dados da conversa.');
          }
          return response.json();
        })
        .then(data => {
          // Supondo que os dados retornados tenham a estrutura: { conversa: [ ... ] }
          const messages = data;
          // Se houver mensagens novas (ou seja, se o array tiver mais itens do que já exibimos)
          if (messages && messages.length > lastIndex) {
            const messagesDiv = document.getElementById("messages");
            for (let i = lastIndex; i < messages.length; i++) {
              const msg = messages[i];
              const messageDiv = document.createElement("div");
              messageDiv.classList.add("message", msg.pessoa);
              messageDiv.id = msg._id;
              messageDiv.textContent = msg.dialogo;
              if (msg.pessoa === "bot") {
                messageDiv.addEventListener("dblclick", function () {
                  createLeaderLine(msg._id, msg.id_referente);
                });
              }
              messagesDiv.appendChild(messageDiv);// Criação do contêiner para o botão de copiar
              const controle = document.createElement("div");
              controle.classList.add("controle");
              const data_hora = document.createElement("div");
              data_hora.classList.add("data_hora");
              const copia = document.createElement("button");
              data_hora.innerHTML = '<label>' + msg.data + ' ' + msg.hora + '</label> <span class="tooltip">Modelo:' + msg.modelo + '</span>';
              copia.innerHTML = '<img src="' + STATIC_URL + 'imgs/copia.png"  alt="Copiar" style="width:20px;height:20px;background:none;"><span class="tooltip">Copiar</span>';

              copia.addEventListener("click", function () {
                navigator.clipboard.writeText(msg.dialogo)
                  .then(() => {
                    copia.innerHTML = '<img src="' + STATIC_URL + 'imgs/copia.png"  alt="Copiar" style="width:20px;height:20px;background:none;"><span class="tooltip">Copiado</span>';

                  })
                  .catch(err => {
                    console.error("Erro ao copiar texto:", err);
                  });
              });
              controle.appendChild(data_hora);
              controle.appendChild(copia);
              messageDiv.appendChild(controle);
            }
            lastIndex = messages.length;
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          }
        })
        .catch(error => console.error('Erro no poll:', error))
        .finally(() => {
          pollTimer = setTimeout(() => pollChat(currentContato), 1500);
        });
    }

    function loadChat(contato) {
      if (pollTimer) {
        clearTimeout(pollTimer);
        pollTimer = null;
      }

      const lis = document.querySelectorAll("ul li");
      lis.forEach(function (item) {
        item.style.backgroundColor = "";
      });
      createLeaderLine('chatTitle', 'chatLabel');
      const liClicado = document.getElementById(contato);
      liClicado.style.backgroundColor = "#494949";
      currentContato = contato;
      document.getElementById("messages").innerHTML = "";
      document.getElementById("input-area").style = "display: flex";
      document.getElementById("messageInput").focus();
      lastIndex = 0;
      pollChat(contato);
    }

    function createLeaderLine(sourceId, targetId) {
      if (leaderLineInstance) {
        leaderLineInstance.remove();
      }

      leaderLineInstance = new LeaderLine(
        document.getElementById(sourceId),
        document.getElementById(targetId),
        {
          color: '#1e1e1e',
          path: 'fluid',         // Opções: 'straight', 'grid', 'fluid', 'arc'
          endPlug: 'arrow',
          startPlug: 'disc'
        }
      );

      return leaderLineInstance;
    }

    function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
          cookie = cookie.trim();
          // Verifica se o cookie começa com o nome desejado
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }
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

    const scrollableDiv = document.getElementById('messages');
    scrollableDiv.addEventListener('scroll', function () {
      leaderLineInstance.position();
    });
    document.querySelectorAll('.sidebar li').forEach(item => {
      item.addEventListener('mouseenter', function() {
        const tooltipText = this.getAttribute('data-tooltip');
        const tooltipDiv = document.getElementById('fixedTooltip');
        const content = document.getElementById('tooltip-content');
        content.textContent = tooltipText;
        tooltipDiv.appendChild(content);
        tooltipDiv.style.display = 'block';
        window.addEventListener("wheel", function(event) {
          document.getElementById("fixedTooltip").scrollTop += event.deltaY;
        }, { passive: false });
      });
    
      item.addEventListener('mouseleave', function() {
        const tooltipDiv = document.getElementById('fixedTooltip');
        tooltipDiv.style.display = 'none';
      });
    });
    
    