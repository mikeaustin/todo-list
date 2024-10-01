import { useEffect } from "react";
import { createStore } from "./store";

const useStore = createStore({
  todos: [
    // {
    //   id: Date.now(),
    //   title: "abc",
    //   completed: false
    // }
  ],
});

const request = createClient("/todos.json");

const updateTodos = todos => state => ({ ...state, todos });

function useQuery(document) {
  const { state: [todos], dispatch } = useStore(state => [
    state.todos
  ]);

  useEffect(() => {
    ((async () => {
      const data = await request(document);

      dispatch(updateTodos(data));
    })());
  }, [dispatch, document]);

  return {
    data: todos
  };
}


function createClient(url: string) {
  const request = async (document, variables = {}) => {
    const result = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        query: document,
        variables
      })
    });

    return result.json();
  };

  return request;
}

export {
  createClient,
  useQuery
};
