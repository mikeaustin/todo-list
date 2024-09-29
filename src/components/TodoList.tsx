import React from "react";

import { useStore } from "../store";
import { completeTodo } from "../reducers";

function TodoList() {
  console.log("TodoList()");

  const { state: [todos], dispatch } = useStore(state => [
    state.todos,
  ]);

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}> {todo.title} {todo.completed && "completed"}
          {!todo.completed && (
            <button onClick={() => dispatch(completeTodo(todo.id))}>
              Complete
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default React.memo(TodoList);
