// Instead of calling useSelector() for each piece of data in Redux for example,
// this prototype allows you to destructure data by passing all selectors to a
// useStore() function. The createStore() function allows you to pass in initial
// data, and returns the useStore() hook to be used in components.

import { parse } from "graphql";
import { NhostClient } from "@nhost/nhost-js";

import TodoList from "./components/TodoList.tsx";
import TodoList2 from "./components/TodoList_GraphQL.tsx";

import { useStore } from "./store.ts";
import { addTodo, setDate } from "./reducers.ts";
import { useMutation, useQuery } from "./utils/graphql.ts";
import { useEffect } from "react";

const nhost = new NhostClient({
  region: "us-east-1",
  subdomain: "jjqlbfsfzstfvpmqtomo",
});

const GET_TODOS = parse(`
  query GetTodos {
    todos {
      id
      title
      flagged
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
      flagged
      completed
    }
  }
`);

function App() {
  console.log("App()");

  useEffect(() => {
    (async () => {
      const response2 = await fetch("https://jjqlbfsfzstfvpmqtomo.auth.us-east-1.nhost.run/v1/signin/email-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "mike_ekim@yahoo.com",
          password: ""
        })
      });

      const session = (await response2.json()).session;

      const response3 = await fetch("https://jjqlbfsfzstfvpmqtomo.graphql.us-east-1.nhost.run/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          query: `
            {
              items {
                id
                title
                comments {
                  id
                  comment
                }
              }
            }
          `
        })
      });

      console.log(await response3.json());
    })();
  }, []);

  const { state: [date], dispatch } = useStore(state => [
    state.date
  ]);

  const { data } = useQuery(GET_TODOS, {});
  const updateTodo = useMutation(UPDATE_TODO);
  const updatePerson = useMutation(UPDATE_TODO);

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
      <button onClick={() => updateTodo({ id: "e3affb88-9af1-4fe9-94dd-ec84e8ac596f", name: Date.now().toString(36) })}>
        Update Person
      </button>
      <ul>
        {data?.todos.map(todo => (
          <li key={todo.id}>
            {todo.title} {todo.assignee?.name} {todo.flagged && "Flagged"} {todo.completed && "Completed"}
            {!todo.completed && (
              <>
                <button onClick={() => updateTodo({ id: todo.id, flagged: !todo.flagged })}>
                  Toggle Flag
                </button>
                <button onClick={() => updateTodo({ id: todo.id, completed: true })}>
                  Complete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <br />
      <TodoList2 />
    </>
  );
}

export default App;
