import { useCallback, useEffect, useRef, useState } from "react";
import { parse, print } from "graphql";

import { createStore } from "./store";

const useStore = createStore({
  types: {
    Todo: {
      0: { id: 0, title: "Hello" }
    }
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

function useQuery(query, variables = {}, types: string[]) {
  const [state, setState] = useState<any>();

  useEffect(() => {
    ((async () => {
      const result = await request(query);

      setState(result.data);
    })());
  }, [query]);

  const handleMessage = useCallback((event: CustomEvent) => {
    console.log("useQuery handleMessage", event.detail);

    setState(state => ({
      ...state,
      ["todos"]: [...state["todos"], event.detail.value]
    }));
  }, []);

  useEffect(() => {
    document.addEventListener("graphql", handleMessage);

    return () => {
      document.removeEventListener("graphql", handleMessage);
    };
  }, [handleMessage]);

  return {
    data: state
  };
}

//

function useMutation(mutation, actions, types) {
  function callback() {
    ((async () => {
      const result = await request(mutation, {}, "/addTodo.json");

      // We don't know which property to update
      Object.values(result.data).forEach((value, index) => {
        document.dispatchEvent(new CustomEvent("graphql", {
          detail: {
            action: actions[index],
            type: types[index],
            value
          }
        }));
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
