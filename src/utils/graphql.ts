import { useEffect, useRef, useState } from "react";
import { createStore } from "./store";

const useStore = createStore({
  data: {
    todos: []
  }
});

function createClient(url: string) {
  const request = async (document, variables = {}, overrideUrl: string) => {
    const result = await fetch(overrideUrl || url, {
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

const request = createClient("/todos.json");

const updateData = data => state => {
  return ({
    ...state,
    data,
  });
};

function useQuery(document, variables = {}, selector = (state: any) => [state.data.todos]) {
  const { state: data, dispatch } = useStore(selector);

  useEffect(() => {
    ((async () => {
      const result = await request(document);

      dispatch(updateData(result.data));
    })());
  }, [dispatch, document]);

  return data;
}

const addTodo = (todo) => state => {
  return ({
    ...state,
    data: {
      ...state.data,
      todos: [...state.data.todos, todo]
    },
  });
};

function useMutation(document) {
  const { dispatch } = useStore(state => [state.data]);

  function callback() {
    ((async () => {
      const result = await request(document, {}, "/addTodo.json");

      dispatch(addTodo(result.data.addTodo));
    })());
  }

  return callback;
}

export {
  createClient,
  useQuery,
  useMutation
};
