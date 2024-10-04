// Instead of calling useSelector() for each piece of data in Redux for example,
// this prototype allows you to destructure data by passing all selectors to a
// useStore() function. The createStore() function allows you to pass in initial
// data, and returns the useStore() hook to be used in components.

import { parse } from "graphql";

import TodoList from "./components/TodoList.tsx";
import { useStore } from "./store.ts";
import { addTodo, setDate } from "./reducers.ts";
import { useMutation, useQuery } from "./utils/graphql.ts";

const GET_TODOS = parse(`
  query GetTodos {
    todos {
      id
      title
      completed
      assignee @type(name: "Person") {
        id
        name
      }
    }
  }
`);

const UPDATE_TODO = parse(`
  mutation UpdateTodo($id: ID!, $completed: Boolean) {
    updateTodo(input: {
      id: $id
      completed: $completed
    }) {
      id
      title
      completed
    }
  }
`);

function App() {
  console.log("App()");

  const { state: [date], dispatch } = useStore(state => [
    state.date
  ]);

  const { data } = useQuery(GET_TODOS);

  const updateTodo = useMutation(UPDATE_TODO);

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
      <ul>
        {data?.todos.map(todo => (
          <li key={todo.id}>
            {todo.title} {todo.assignee?.name} {todo.completed && "Completed"}
            {!todo.completed && (
              <button onClick={() => updateTodo({ id: "9a855f3d-80e4-4e2a-8ab9-1194ab1cd49b", completed: true })}>
                Complete
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
