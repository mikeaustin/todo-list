type Todo = {
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
  { title: state.date + " : " + title.toString(), completed: false }
]));

const setDate = (date: number) => (state: State) => ({
  ...state,
  date
});

const _completeTodo = (title: string) => (state: State) => ({
  ...state,
  todos: state.todos.map(todo => todo.title === title
    ? { ...todo, completed: true }
    : todo)
});

const update = (id: string, object: Partial<Todo>) => (array: Todo[]) => {
  return array.map(todo => todo.title === id
    ? { ...todo, ...object }
    : todo
  );
};

const completeTodo = (title: string) => updateTodos(todos => (
  todos.map(todo => todo.title === title
    ? { ...todo, completed: true }
    : todo)
));

const completeTodo2 = (title: string) => updateTodos(todos => (
  update(title, { completed: true })(todos)
));

export {
  updateTodos,
  addTodo,
  setDate,
  completeTodo,
};
