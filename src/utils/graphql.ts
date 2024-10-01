import { useEffect, useRef, useState } from "react";
import { createStore } from "./store";

const useStore = createStore({
  data: {
    todos: [
      // {
      //   id: Date.now(),
      //   title: "abc",
      //   completed: false
      // }
    ]
  },
  types: {}
});

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

const addTodo = (title: string) => state => {
  return ({
    ...state,
    data: {
      ...state.data,
      todos: [...state.data.todos, { id: Date.now(), title, completed: false }]
    },
  });
};

function useMutation(document) {
  const { state: [data], dispatch } = useStore(state => [state.data]);

  function callback() {
    dispatch(addTodo("Another"));
  }

  return callback;
}

export {
  createClient,
  useQuery,
  useMutation
};
