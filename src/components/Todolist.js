import { saveLocalTodos, getTodos } from '../utils/localStorage.js';

class Todolist {
  constructor() {
    this.addButton = document.querySelector('#add');
    this.input = document.querySelector('#new');
    this.columns = document.querySelectorAll('.column');
    this.filter = document.querySelector('.filter');

    this.todos = getTodos();

    this.addEventListeners();
  }

  addEventListeners() {
    this.addButton.addEventListener('click', (e) => this.addTodo(e));
    this.filter.addEventListener('change', () => this.render());
  }

  addTodo(e) {
    e.preventDefault();
    const task = this.input.value.trim();

    if (task === '' || this.todos.length >= 20) {
      alert(
        'Please enter a task or you have reached the maximum number of tasks.'
      );
      this.input.value = '';
      return;
    }

    this.todos.push({ task, completed: false });

    saveLocalTodos(this.todos);
    this.render();

    this.input.value = '';
  }

  removeTodo(todoEl, i) {
    todoEl.querySelector('.trash-btn').addEventListener('click', () => {
      todoEl.classList.add('fall');
      todoEl.addEventListener('transitionend', () => this.render());
      this.todos.splice(i, 1);
      saveLocalTodos(this.todos);
    });
  }

  filterTodos() {
    const filterOption = this.filter.value;
    return this.todos.filter((todo) => {
      switch (filterOption) {
        case 'completed':
          return todo.completed;
        case 'uncompleted':
          return !todo.completed;
        default:
          return true;
      }
    });
  }

  editTodo(todoEl, i) {
    const editButton = todoEl.querySelector('.edit-btn');
    const todoText = todoEl.querySelector('.todo-item');

    editButton.addEventListener('click', (e) => {
      e.stopPropagation();
      todoText.contentEditable = 'true';
      todoText.focus();
      setCursorToEnd(todoText);
    });

    todoText.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveEdit();
      }
    });

    todoText.addEventListener('blur', saveEdit.bind(this));

    function saveEdit() {
      const trimmedText = todoText.textContent.trim();
      this.todos[i].task =
        trimmedText === '' ? this.todos[i].task : trimmedText;
      saveLocalTodos(this.todos);
      todoText.contentEditable = 'false';
    }

    function setCursorToEnd(element) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  toggleCompleted(todoEl, i) {
    const taskText = todoEl.querySelector('.todo-item');
    const editButton = todoEl.querySelector('.edit-btn');
    const trashButton = todoEl.querySelector('.trash-btn');

    todoEl.addEventListener('click', (e) => {
      if (
        taskText.contentEditable === 'false' &&
        e.target !== editButton &&
        e.target !== trashButton
      ) {
        this.todos[i].completed = !this.todos[i].completed;
        todoEl.classList.toggle('completed');
        todoEl.querySelector('.complete-btn').classList.toggle('checked');
        saveLocalTodos(this.todos);
      }
    });
  }

  createTodoElement(todo) {
    const todoEl = document.createElement('div');
    todoEl.className = 'todo';
    todoEl.innerHTML = `
      <span class="todo-item" contentEditable="false">${todo.task}</span>
      <button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
      <button class="complete-btn"><i class="fa-solid fa-circle-check"></i></button>
      <button class="trash-btn"><i class="fas fa-trash"></i></button>`;
    return todoEl;
  }

  render() {
    this.columns.forEach((column) => column.remove());
    this.columns = [];

    this.filterTodos().forEach((todo, i) => {
      const columnIndex = Math.floor(i / 10);

      if (!this.columns[columnIndex]) {
        const newColumn = document.createElement('div');
        newColumn.className = 'column';
        this.columns.push(newColumn);
        document.querySelector('.todolist').appendChild(newColumn);
      }

      const todoEl = this.createTodoElement(todo);
      const todoIndex = this.todos.indexOf(todo);

      this.removeTodo(todoEl, todoIndex);
      this.toggleCompleted(todoEl, todoIndex);
      this.editTodo(todoEl, todoIndex);

      if (todo.completed) {
        todoEl.classList.add('completed');
        todoEl.querySelector('.complete-btn').classList.add('checked');
      }

      this.columns[columnIndex].appendChild(todoEl);
    });
  }
}

const todolist = new Todolist();

export default todolist;
