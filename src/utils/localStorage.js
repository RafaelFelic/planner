export const saveLocalTodos = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

export const getTodos = () => {
  const savedTodos = localStorage.getItem('todos');
  return savedTodos ? JSON.parse(savedTodos) : [];
};
