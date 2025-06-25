function criarElementoTarefa(texto, concluida) {
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
    atualizarStatusTarefa(texto, checkConcluido.checked);
  });

  checkNao.addEventListener('change', () => {
    checkConcluido.checked = !checkNao.checked;
    li.classList.toggle('completed', checkConcluido.checked);
    atualizarStatusTarefa(texto, checkConcluido.checked);
  });

  
  const botaoRemover = document.createElement('button');
  botaoRemover.innerText = 'Remover';
  botaoRemover.className = 'remover-btn';
  botaoRemover.addEventListener('click', () => {
    li.remove();
    tarefas = tarefas.filter(t => t.texto !== texto);
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
