import { useCallback, useEffect, useRef, useState } from "react";
import { DocumentNode, print } from "graphql";

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

  return request;
}

const request = createClient("/todos.json");

function useQuery(query: DocumentNode) {
  const [state, setState] = useState<any>();

  const stateRef = useRef<any>(state);

  useEffect(() => {
    ((async () => {
      const result = await request(query);

      setState(result.data);

      stateRef.current = result.data;
    })());
  }, [query]);

  const updateState = useCallback((state: any, data: any) => {
    let isDirty = false;

    if (Array.isArray(state)) {
      state.forEach(element => {
        if (updateState(element, data)) {
          isDirty = true;
        }
      });
    }

    if (typeof state === "object") {
      if (state.id === data.id) {
        Object.assign(state, data);

        isDirty = true;
      }

      Object.entries(state).forEach(([name, value]) => {
        if (updateState(value, data)) {
          isDirty = true;
        }
      });
    }

    return isDirty;
  }, []);

  const handleMessage = useCallback((event: CustomEvent) => {
    const isDirty = updateState(stateRef.current, event.detail.value);

    if (isDirty) {
      setState({ ...stateRef.current });
    }
  }, [updateState]);

  useEffect(() => {
    document.addEventListener("graphql", handleMessage as EventListener);

    return () => {
      document.removeEventListener("graphql", handleMessage as EventListener);
    };
  }, [handleMessage]);

  return {
    data: state,
  };
}

//

function useMutation(mutation: DocumentNode) {
  function callback(variables: object) {
    document.dispatchEvent(new CustomEvent("graphql", {
      detail: {
        value: variables
      }
    }));

    ((async () => {
      setTimeout(async () => {
        const result = await request(mutation, variables, "/updateTodo.json");

        return result;
      }, 1000);
    })());
  }

  return callback;
}

export {
  createClient,
  useQuery,
  useMutation
};
