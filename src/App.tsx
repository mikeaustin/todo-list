// Instead of calling useSelector() for each piece of data in Redux for example,
// this prototype allows you to destructure data by passing all selectors to a
// useStore() function. The createStore() function allows you to pass in initial
// data, and returns the useStore() hook to be used in components.

import TodoList from "./components/TodoList.tsx";
import { useStore } from "./store.ts";
import { addTodo, setDate } from "./reducers.ts";
import { createClient, useMutation } from "./utils/graphql.ts";
import { useQuery } from "./utils/graphql.ts";

const GET_TODOS = `
  query GetTodos {
    todos {
      id
      title
      completed
    }
  }
`;

const ADD_TODO = `
  mutation AddTodo {
    addTodo(input: {
      title: "Another"
    }) {
      id
      title
      completed
    }
  }
`;

function App() {
  console.log("App()");

  const { state: [date], dispatch } = useStore(state => [
    state.date
  ]);

  const [todos] = useQuery(GET_TODOS);
  const createTodo = useMutation(ADD_TODO);

  console.log('App data', todos);

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
      <br />
      <button onClick={createTodo}>Add Todo</button>
      <ul>
        {todos?.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
