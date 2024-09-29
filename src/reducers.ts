const merge = <T>(todo2: Partial<T>) => (todo: T) => {
  return { ...todo, ...todo2 };
};

const update = <T>(selector: (todo: T) => boolean, updater: (todo: T) => T) => (todos: T[]) => {
  const foundIndex = todos.findIndex(selector);

  return todos.map((todo, index) => index === foundIndex
    ? { ...todo, ...updater(todo) }
    : todo
  );
};

const remove = (id: number) => (todos: Todo[]) => {
  return todos.filter(todo => todo.id !== id);
};

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

const updateTodo = (id: number, updater: (todo: Todo) => Todo) => (todos: Todo[]) => (
  update(todo => todo.id === id, updater)(todos)
);

//

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

const completeTodo2 = (id: number) => updateTodos(todos => (
  todos.map(todo => todo.id === id
    ? { ...todo, completed: true }
    : todo
  )
));

const completeTodo3 = (id: number) => updateTodos(todos => (
  update(todo => todo.id === id, merge<Todo>({ completed: true }))(todos)
));

const completeTodo = (id: number) => updateTodos(todos => (
  updateTodo(id, merge<Todo>({ completed: true }))(todos)
));

export {
  updateTodos,
  addTodo,
  setDate,
  completeTodo,
};
