let tarefas = [];

function salvarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function carregarTarefas() {
  const dadosSalvos = localStorage.getItem('tarefas');
  if (dadosSalvos) {
    tarefas = JSON.parse(dadosSalvos);
    tarefas.forEach(tarefa => {
      criarElementoTarefa(tarefa.texto, tarefa.concluida);
    });
  }
}

function adicionarTarefa() {
  const input = document.getElementById('novaTarefa');
  const texto = input.value.trim();
  if (texto === '') return;

  // Salva primeiro no array
  tarefas.push({ texto, concluida: false });
  salvarTarefas();

  // Depois renderiza na tela
  criarElementoTarefa(texto, false);
  input.value = '';
}

function criarElementoTarefa(texto, concluida) {
  const li = document.createElement('li');
  if (concluida) li.classList.add('completed');

  const span = document.createElement('span');
  span.className = 'tarefa-texto';
  span.innerText = texto;

  // Emojis explicativos
  const labelContainer = document.createElement('div');
  labelContainer.className = 'emoji-labels';
  labelContainer.innerHTML = '<span title="Concluído">✅</span> <span title="Não concluído">❌</span>';

  // Checkboxes
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
    atualizarStatusTarefa(texto, checkConcluido.checked);
  });

  checkNao.addEventListener('change', () => {
    checkConcluido.checked = !checkNao.checked;
    li.classList.toggle('completed', checkConcluido.checked);
    atualizarStatusTarefa(texto, checkConcluido.checked);
  });

  const checkboxContainer = document.createElement('div');
  checkboxContainer.className = 'checkbox-container';
  checkboxContainer.appendChild(labelContainer);
  checkboxContainer.appendChild(checkConcluido);
  checkboxContainer.appendChild(checkNao);

  li.appendChild(span);
  li.appendChild(checkboxContainer);
  document.getElementById('listaTarefas').appendChild(li);
}

function atualizarStatusTarefa(texto, status) {
  const tarefa = tarefas.find(t => t.texto === texto);
  if (tarefa) {
    tarefa.concluida = status;
    salvarTarefas();
  }
}

window.addEventListener('load', carregarTarefas);
