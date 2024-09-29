type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

type State = {
  todos: Todo[];
  date: number;
};

const updateTodos = (todosReducer: (todos: Todo[], state: State) => Todo[]) => (state: State) => ({
  ...state,
  todos: todosReducer(state.todos, state)
});

const addTodo = (title: string | number) => updateTodos((todos, state) => ([
  ...todos,
  { id: Date.now(), title: state.date + " : " + title.toString(), completed: false }
]));

const setDate = (date: number) => (state: State) => ({
  ...state,
  date
});

const _completeTodo = (id: number) => (state: State) => ({
  ...state,
  todos: state.todos.map(todo => todo.id === id
    ? { ...todo, completed: true }
    : todo)
});

const merge = (...todos: Todo[]) => {
  return Object.assign({}, ...todos);
};

const update = (selector: (todo: Todo) => boolean, object: Partial<Todo>) => (todos: Todo[]) => {
  const foundIndex = todos.findIndex(selector);

  return todos.map((todo, index) => index === foundIndex
    ? { ...todo, ...object }
    : todo
  );
};

const remove = (id: number) => (todos: Todo[]) => {
  return todos.filter(todo => todo.id !== id);
};

const completeTodo2 = (id: number) => updateTodos(todos => (
  todos.map(todo => todo.id === id
    ? { ...todo, completed: true }
    : todo)
));

const completeTodo = (id: number) => updateTodos(todos => (
  update(todo => todo.id === id, { completed: true })(todos)
));

export {
  updateTodos,
  addTodo,
  setDate,
  completeTodo,
};
