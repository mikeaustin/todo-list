import { useEffect, useMemo, useRef } from "react";
import { parse, print, DocumentNode } from "graphql";

import { createStore } from "./store.ts";

type State = {
  [type: string]: object[];
};

const useStore = createStore({} as State);

const updateQueryState = (type: string, elements: object[]) => (state: State) => ({
  ...state,
  [type]: elements
});

const updateMutationState = (type: string, id: string, element: object) => (state: State) => ({
  ...state,
  [type]: {
    ...state[type],
    [id]: { ...state[type][id], ...element },
  }
});

//

function createClient(url: string) {
  const request = async (document: DocumentNode, variables = {}, overrideUrl?: string) => {
    const result = await fetch(overrideUrl || url, {
      method: "POST",
      body: JSON.stringify({
        query: print(document),
        variables
      })
    });

    return result.json();
  };

  function useQuery(query: DocumentNode, _variables = {}) {
    // Get types

    const variablesJSON = JSON.stringify(_variables);

    const { state: [...types], dispatch } = useStore(state => [state["Todo"]]);
    const variables = useMemo(() => JSON.parse(variablesJSON), [variablesJSON]);
    const dataRef = useRef();

    console.log("types", types);

    useEffect(() => {
      (async () => {
        const result = await request(query, variables);

        dispatch(updateQueryState("Todo", result.data.todos.reduce((object, todo) => ({
          ...object,
          [todo.id]: todo
        }), [])));

        dataRef.current = result.data;
      })();
    }, [dispatch, query, variables]);

    return {
      data: dataRef.current
    };
  }

  function useMutation(mutation: DocumentNode, _variables = {}) {
    const { dispatch } = useStore(state => []);

    function callback() {
      dispatch(updateMutationState("Todo", "9a855f3d-80e4-4e2a-8ab9-1194ab1cd49b", { flagged: true }));
    }

    return callback;
  }

  return {
    request,
    useQuery,
    useMutation
  };
}

export {
  parse as gql,
  createClient
};
