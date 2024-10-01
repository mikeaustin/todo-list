import { useEffect, useRef, useState } from "react";
import { parse, print } from "graphql";

import { createStore } from "./store";

const useStore = createStore({
  data: {
    todos: [],
    people: []
  }
});

function createClient(url: string) {
  const request = async (document, variables = {}, overrideUrl: string) => {
    const result = await fetch(overrideUrl || url, {
      method: "POST",
      body: JSON.stringify({
        query: print(document),
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

function useQuery(query, variables = {}, selector) {
  const { state: data, dispatch } = useStore(selector);

  useEffect(() => {
    ((async () => {
      const result = await request(query);

      dispatch(updateData(result.data));
    })());
  }, [dispatch, query]);

  const handleMessage = () => {
    console.log("useQuery handleMessage");
  };

  useEffect(() => {
    document.addEventListener("graphql", handleMessage);
  }, []);

  return data;
}

//

const createItem = (field: string, item) => state => {
  return ({
    ...state,
    data: {
      ...state.data,
      [field]: [...state.data[field], item]
    },
  });
};

const updateItem = (field: string, item) => state => {
  return ({
    ...state,
    data: {
      ...state.data,
      [field]: [...state.data[field], item]
    },
  });
};

// Need to know if create, update, or delete
function useMutation(mutation, types, fields) {
  const { dispatch } = useStore(state => []);

  function callback() {
    ((async () => {
      const result = await request(mutation, {}, "/addTodo.json");

      // We don't know which property to update
      Object.values(result.data).forEach((value, index) => {
        switch (types[index]) {
          case "create":
            dispatch(createItem(fields[index], value));

            document.dispatchEvent(new CustomEvent("graphql"));
        }
      });
    })());
  }

  return callback;
}

export {
  createClient,
  useQuery,
  useMutation
};
