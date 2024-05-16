document.addEventListener('DOMContentLoaded', function () {
  // Inicialização dos componentes
  const components = document.querySelectorAll('.component');
  let currentComponentIndex = 0;

  function switchComponent(newIndex) {
    components.forEach((component, index) => {
      component.style.transform = `translateX(-${newIndex * 100}%)`;
    });
    currentComponentIndex = newIndex;
  }

  // Inicialmente, mostrar o Todo List
  switchComponent(0);

  // Funções para alternar entre os componentes
  let startX;
  let dist;
  const threshold = 100; // Distância mínima para considerar um deslizamento

  function touchStart(e) {
    const touchObj = e.changedTouches[0];
    startX = touchObj.pageX;
    dist = 0;
  }

  function touchEnd(e) {
    const touchObj = e.changedTouches[0];
    dist = touchObj.pageX - startX;

    if (Math.abs(dist) >= threshold) {
      if (dist > 0 && currentComponentIndex > 0) {
        // Deslizou para a direita
        switchComponent(0);
      } else if (dist < 0 && currentComponentIndex < components.length - 1) {
        // Deslizou para a esquerda
        switchComponent(1);
      }
    }
    e.preventDefault();
  }

  // Adiciona eventos de toque
  document.addEventListener('touchstart', touchStart, false);
  document.addEventListener('touchend', touchEnd, false);

  // Função para adicionar tarefas
  function addTask() {
    const newTaskInput = document.getElementById('new_task');
    const newTask = newTaskInput.value.trim();

    if (newTask) {
      const tasksList = document.getElementById('tasks_list');
      const li = document.createElement('li');
      li.textContent = newTask;

      const removeButton = document.createElement('span');
      removeButton.textContent = '❌';
      removeButton.classList.add('remove_task');
      removeButton.onclick = function () {
        this.parentElement.remove();
      };

      li.appendChild(removeButton);
      tasksList.appendChild(li);
      newTaskInput.value = '';
    }
  }

  // Vincula a função addTask ao botão de adicionar
  const addButton = document.querySelector('#todo_list button');
  addButton.onclick = addTask;
});
