const merge = <T>(todo2: Partial<T>) => (todo: T) => {
  return { ...todo, ...todo2 };
};

const update = <T>(key: number, updater: (todo: T) => T) => (todos: T[]) => {
  return todos.map((todo, index) => index === key
    ? updater(todo)
    : todo
  );
};

update(0, (todo: Todo) => ({ ...todo, completed: true }));

const remove = (id: number) => (todos: Todo[]) => {
  return todos.filter(todo => todo.id !== id);
};

//

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

const updateTodo = (id: number, updater: (todo: Todo) => Todo) => (todos: Todo[]) => {
  const index = todos.findIndex(todo => todo.id === id);

  return update(index, updater)(todos);
};

//

const setDate = (date: number) => (state: State) => ({
  ...state,
  date
});

const addTodo = (title: string | number) => updateTodos((todos, state) => ([
  ...todos,
  { id: Date.now(), title: state.date + " : " + title.toString(), completed: false }
]));

const completeTodo = (id: number) => updateTodos(todos => (
  updateTodo(id, merge<Todo>({ completed: true }))(todos)
));

export {
  setDate,
  updateTodos,
  addTodo,
  updateTodo,
  completeTodo,
};
