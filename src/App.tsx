// Instead of calling useSelector() for each piece of data in Redux for example,
// this prototype allows you to destructure data by passing all selectors to a
// useStore() function. The createStore() function allows you to pass in initial
// data, and returns the useStore() hook to be used in components.

import TodoList from "./components/TodoList.tsx";
import { useStore } from "./store.ts";
import { addTodo, setDate } from "./reducers.ts";
import { createClient } from "./utils/graphql.ts";

function App() {
  console.log("App()", createClient);

  const { state: [date], dispatch } = useStore(state => [
    state.date
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
