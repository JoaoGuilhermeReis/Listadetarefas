let tarefas = [];

function salvarTarefas() {
  localStorage.setItem('tarefas_petrox', JSON.stringify(tarefas));
}

function carregarTarefas() {
  const dadosSalvos = localStorage.getItem('tarefas_petrox');
  if (dadosSalvos) {
    tarefas = JSON.parse(dadosSalvos);
    tarefas.forEach(tarefa => {
      criarElementoTarefa(tarefa.id, tarefa.texto, tarefa.concluida);
    });
  }
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

  criarElementoTarefa(id, texto, false);
  input.value = '';
  input.focus(); // Retorna o foco para digitar a próxima rapidamente
}

// Permite adicionar a tarefa apertando "Enter"
document.getElementById('novaTarefa').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    adicionarTarefa();
  }
});

function criarElementoTarefa(id, texto, concluida) {
  const lista = document.getElementById('listaTarefas');
  const li = document.createElement('li');
  
  if (concluida) {
    li.classList.add('completed');
  }

  // Checkbox único e funcional
  const checkStatus = document.createElement('input');
  checkStatus.type = 'checkbox';
  checkStatus.checked = concluida;
  checkStatus.title = 'Marcar/Desmarcar como concluída';

  checkStatus.addEventListener('change', () => {
    const isChecked = checkStatus.checked;
    li.classList.toggle('completed', isChecked);
    atualizarStatusTarefa(id, isChecked);
  });

  const span = document.createElement('span');
  span.className = 'tarefa-texto';
  span.innerText = texto;

  const botaoRemover = document.createElement('button');
  botaoRemover.innerText = 'Excluir';
  botaoRemover.className = 'remover-btn';
  
  botaoRemover.addEventListener('click', () => {
    // Adiciona uma animação suave antes de remover
    li.style.opacity = '0';
    setTimeout(() => {
      li.remove();
      tarefas = tarefas.filter(t => t.id !== id);
      salvarTarefas();
    }, 200);
  });

  // Montagem do elemento (Item da lista)
  li.appendChild(checkStatus);
  li.appendChild(span);
  li.appendChild(botaoRemover);

  lista.appendChild(li);
}

function atualizarStatusTarefa(id, status) {
  const tarefaIndex = tarefas.findIndex(t => t.id === id);
  if (tarefaIndex !== -1) {
    tarefas[tarefaIndex].concluida = status;
    salvarTarefas();
  }
}

// Inicia o app carregando as informações salvas
window.addEventListener('load', carregarTarefas);
