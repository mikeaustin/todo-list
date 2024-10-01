import { useEffect, useRef } from "react";
import { createStore } from "./store";

const useStore = createStore({
  data: [
    // {
    //   id: Date.now(),
    //   title: "abc",
    //   completed: false
    // }
  ],
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
  console.log('qqq', data.todos[0]);

  return ({
    ...state,
    data,
    // types: {
    //   ...state.types,
    //   [data[0].__typename]: data
    // }
  });
};

function useQuery(document, variables = {}, selector = state => [state.data]) {
  const resultRef = useRef();

  // TODO: selector is based on document node types 
  // Need to not select on data or else we'll always render
  const { state: [types, data], dispatch } = useStore(state => [
    // state.data,
    state.types,
    ...selector(state)
  ]);

  useEffect(() => {
    ((async () => {
      const result = await request(document);

      dispatch(updateData(result.data));
    })());
  }, [dispatch, document]);

  console.log('data', data);

  return {
    data
  };
}

function useMutation(document) {
  const { state: [data], dispatch } = useStore(state => [state.data]);

  function callback() {
    dispatch(updateData({
      ...data,
      todos: [
        ...data.todos,
        { id: Date.now(), title: "Another", completed: false }
      ]
    }));
  }

  return callback;
}

export {
  createClient,
  useQuery,
  useMutation
};
