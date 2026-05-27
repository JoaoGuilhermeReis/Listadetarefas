let tarefas = [];
let filtroAtual = 'all'; // Pode ser 'all', 'active' ou 'completed'

function salvarTarefas() {
  localStorage.setItem('tarefas_petrox_v2', JSON.stringify(tarefas));
}

function carregarTarefas() {
  const dadosSalvos = localStorage.getItem('tarefas_petrox_v2');
  if (dadosSalvos) {
    tarefas = JSON.parse(dadosSalvos);
  }
  renderizar();
}

function gerarId() {
  return Date.now() + Math.random().toString(36).substring(2, 9);
}

function adicionarTarefa() {
  const input = document.getElementById('novaTarefa');
  const texto = input.value.trim();
  
  if (texto === '') return;

  const id = gerarId();
  tarefas.push({ id, texto, concluida: false });
  salvarTarefas();

  input.value = '';
  input.focus();
  renderizar();
}

document.getElementById('novaTarefa').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    adicionarTarefa();
  }
});

// Altera a visualização baseado no filtro clicado
function mudarFiltro(novoFiltro) {
  filtroAtual = novoFiltro;
  
  // Atualiza a classe ativa nos botões visualmente
  document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('ativo'));
  document.getElementById(`filtro-${novoFiltro}`).classList.add('ativo');
  
  renderizar();
}

// Funcionalidade solicitada: Marca ou desmarca tudo dinamicamente
function alternarTodas() {
  // Se houver pelo menos uma tarefa pendente, o objetivo é marcar todas como concluídas.
  // Se todas já estiverem concluídas, ele limpa todas para pendentes.
  const temPendentes = tarefas.some(t => !t.concluida);
  
  tarefas.forEach(t => {
    t.concluida = temPendentes;
  });
  
  salvarTarefas();
  renderizar();
}

// Remove apenas as que estão marcadas como concluídas
function limparConcluidas() {
  tarefas = tarefas.filter(t => !t.concluida);
  salvarTarefas();
  renderizar();
}

// Função central de renderização baseada no Estado (State-driven)
function renderizar() {
  const lista = document.getElementById('listaTarefas');
  const estadoVazio = document.getElementById('estadoVazio');
  const btnAlternarTodas = document.getElementById('btnAlternarTodas');
  const contador = document.getElementById('contador');
  
  lista.innerHTML = '';

  // 1. Filtragem dos dados antes de exibir na tela
  let tarefasFiltradas = tarefas;
  if (filtroAtual === 'active') {
    tarefasFiltradas = tarefas.filter(t => !t.concluida);
  } else if (filtroAtual === 'completed') {
    tarefasFiltradas = tarefas.filter(t => t.concluida);
  }

  // 2. Controle do painel de estado vazio
  if (tarefasFiltradas.length === 0) {
    estadoVazio.style.display = 'block';
  } else {
    estadoVazio.style.display = 'none';
  }

  // 3. Construção dos elementos em tela
  tarefasFiltradas.forEach(tarefa => {
    const li = document.createElement('li');
    if (tarefa.concluida) li.classList.add('completed');

    const checkStatus = document.createElement('input');
    checkStatus.type = 'checkbox';
    checkStatus.checked = tarefa.concluida;
    checkStatus.addEventListener('change', () => {
      tarefa.concluida = checkStatus.checked;
      salvarTarefas();
      renderizar(); 
    });

    const span = document.createElement('span');
    span.className = 'tarefa-texto';
    span.innerText = tarefa.texto;

    const botaoRemover = document.createElement('button');
    botaoRemover.innerText = 'Excluir';
    botaoRemover.className = 'remover-btn';
    botaoRemover.addEventListener('click', () => {
      li.style.opacity = '0';
      setTimeout(() => {
        tarefas = tarefas.filter(t => t.id !== tarefa.id);
        salvarTarefas();
        renderizar();
      }, 150);
    });

    li.appendChild(checkStatus);
    li.appendChild(span);
    li.appendChild(botaoRemover);
    lista.appendChild(li);
  });

  // 4. Atualização das informações de contagem gerais
  const pendentes = tarefas.filter(t => !t.concluida).length;
  contador.innerText = `${pendentes} ${pendentes === 1 ? 'pendente' : 'pendentes'}`;

  // 5. Ajuste inteligente do texto do botão principal
  if (tarefas.length > 0 && tarefas.every(t => t.concluida)) {
    btnAlternarTodas.innerText = 'Desmarcar todas';
  } else {
    btnAlternarTodas.innerText = 'Marcar todas';
  }
}

window.addEventListener('load', carregarTarefas);
