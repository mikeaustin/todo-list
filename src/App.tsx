// Instead of calling useSelector() for each piece of data in Redux for example,
// this prototype allows you to destructure data by passing all selectors to a
// useStore() function. The createStore() function allows you to pass in initial
// data, and returns the useStore() hook to be used in components.

import TodoList from "./components/TodoList";
import { useStore } from "./store";

type Todo = {
  title: string;
  completed: boolean;
};

type State = {
  todos: Todo[];
  date: number;
};

const updateTodos = (todosReducer: (todos: Todo[]) => Todo[]) => (state: State) => ({
  ...state,
  todos: todosReducer(state.todos)
});

const addTodo = (title: string | number) => updateTodos((todos: Todo[]) => ([
  ...todos,
  { title: title.toString(), completed: false }
]));

const setDate = (date: number) => (state: State) => ({
  ...state,
  date
});

function App() {
  console.log("App()");

  const { state: [date], dispatch } = useStore([
    state => state.date
  ]);

  return (
    <>
      {date}
      <br />
      <button onClick={() => dispatch(setDate(Date.now()))}>
        Set Date
      </button>
      &nbsp;
      <button onClick={() => dispatch(addTodo(Date.now() % 100000))}>
        Add Todo
      </button>
      <TodoList />
    </>
  );
}

export default App;
