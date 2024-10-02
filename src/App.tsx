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

const ADD_TODO = parse(`
  mutation AddTodo {
    addTodo(input: {
      title: "Another"
    }) @create(name: "Todo") {
      id
      title
      completed
    }
  }
`);

const UPDATE_PERSON = parse(`
  mutation UpdatePerson {
    updatePerson(input: {
      id: 0,
      name: "Sue"
    }) @update(name: "Person") {
      id
      name
    }
  }
`);

function App() {
  console.log("App()");

  const { state: [date], dispatch } = useStore(state => [
    state.date
  ]);

  // This will watch for changed todos, but not if an assignee name changes
  const { data } = useQuery(GET_TODOS, {}, ["Todo"]);

  const createTodo = useMutation(ADD_TODO, ["create"], ["Todo"]);
  const updatePerson = useMutation(UPDATE_PERSON, ["update"], ["Person"]);

  console.log('App data', data);

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
        {data?.todos.map(todo => (
          <li key={todo.id}>{todo.title} {todo.assignee?.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
