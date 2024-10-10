// import { useMutation } from "../utils/graphql";
import { gql, createClient } from "../utils/graphql2";

const { useMutation, useQuery } = createClient("/todos.json");

const GET_TODOS = gql(`
  query GetTodos {
    todos {
      id
      title
      flagged
    }
  }
`);

function TodoList() {
  const { data } = useQuery(GET_TODOS);
  const updateTodo = useMutation(GET_TODOS);

  return (
    <ul>
      {data?.todos.map(todo => (
        <li key={todo.id}>
          {todo.title} {todo.flagged && "Flagged"}
          <button onClick={() => updateTodo()}>Toggle Flag</button>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
