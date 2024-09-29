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

const addTodo = (title: string | number) => updateTodos((todos: Todo[], state: State) => ([
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

const completeTodo = (title: string) => updateTodos((todos: Todo[]) => (
  todos.map(todo => todo.title === title
    ? { ...todo, completed: true }
    : todo)
));

export {
  updateTodos,
  addTodo,
  setDate,
  completeTodo,
};
