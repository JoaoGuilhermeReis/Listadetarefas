let tarefas = [];

function salvarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function carregarTarefas() {
  const dadosSalvos = localStorage.getItem('tarefas');
  if (dadosSalvos) {
    tarefas = JSON.parse(dadosSalvos);
    tarefas.forEach(tarefa => {
      criarElementoTarefa(tarefa.id, tarefa.texto, tarefa.concluida);
    });
  }
}

function gerarId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
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
}

function criarElementoTarefa(id, texto, concluida) {
  const li = document.createElement('li');
  if (concluida) li.classList.add('completed');

  const span = document.createElement('span');
  span.className = 'tarefa-texto';
  span.innerText = texto;

  
  const labelContainer = document.createElement('div');
  labelContainer.className = 'emoji-labels';
  labelContainer.innerHTML = '<span title="Concluído">✅</span> <span title="Não concluído">❌</span>';

  
  const checkConcluido = document.createElement('input');
  checkConcluido.type = 'checkbox';
  checkConcluido.checked = concluida;
  checkConcluido.title = 'Marcar como concluída';

  const checkNao = document.createElement('input');
  checkNao.type = 'checkbox';
  checkNao.checked = !concluida;
  checkNao.title = 'Marcar como não concluída';

  checkConcluido.addEventListener('change', () => {
    checkNao.checked = !checkConcluido.checked;
    li.classList.toggle('completed', checkConcluido.checked);
    atualizarStatusTarefa(id, checkConcluido.checked);
  });

  checkNao.addEventListener('change', () => {
    checkConcluido.checked = !checkNao.checked;
    li.classList.toggle('completed', checkConcluido.checked);
    atualizarStatusTarefa(id, checkConcluido.checked);
  });


  const botaoRemover = document.createElement('button');
  botaoRemover.innerText = 'Remover';
  botaoRemover.className = 'remover-btn';
  botaoRemover.addEventListener('click', () => {
    li.remove();
    tarefas = tarefas.filter(t => t.id !== id);
    salvarTarefas();
  });

  const checkboxContainer = document.createElement('div');
  checkboxContainer.className = 'checkbox-container';
  checkboxContainer.appendChild(labelContainer);
  checkboxContainer.appendChild(checkConcluido);
  checkboxContainer.appendChild(checkNao);

  li.appendChild(span);
  li.appendChild(checkboxContainer);
  li.appendChild(botaoRemover);

  document.getElementById('listaTarefas').appendChild(li);
}

function atualizarStatusTarefa(id, status) {
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa) {
    tarefa.concluida = status;
    salvarTarefas();
  }
}

window.addEventListener('load', carregarTarefas);
