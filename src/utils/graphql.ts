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

function useQuery(document, variables = {}, selector) {
  const { state: data, dispatch } = useStore(selector);

  useEffect(() => {
    ((async () => {
      const result = await request(document);

      dispatch(updateData(result.data));
    })());
  }, [dispatch, document]);

  return data;
}

const createItem = (field: string, item) => state => {
  return ({
    ...state,
    data: {
      ...state.data,
      [field]: [...state.data[field], item]
    },
  });
};

// Need to know if create, update, or delete
function useMutation(document, types, fields) {
  const { dispatch } = useStore(state => [state.data]);

  function callback() {
    ((async () => {
      const result = await request(document, {}, "/addTodo.json");

      // We don't know which property to update
      Object.values(result.data).forEach((value, index) => (
        dispatch(createItem(fields[index], value))
      ));
    })());
  }

  return callback;
}

export {
  createClient,
  useQuery,
  useMutation
};
