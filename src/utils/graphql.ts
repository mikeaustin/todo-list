import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const updateState = (
  value: object & { id: string; } | string,
  partialData: { [key: string]: unknown; },
) => {
  let isDirty = false;

  if (Array.isArray(value)) {
    for (const element of value) {
      if (updateState(element, partialData)) {
        isDirty = true;
      }
    }
  }

  if (typeof value === "object") {
    if (value.id === partialData.id) {
      Object.assign(value, partialData);

      isDirty = true;
    } else {
      Object.values(value).forEach((propertyValue) => {
        if (updateState(propertyValue, partialData)) {
          isDirty = true;
        }
      });
    }
  }

  return isDirty;
};

function useQuery(query: DocumentNode, variables = {}) {
  const [state, setState] = useState<any>();
  const stateRef = useRef<any>(state);

  const variablesJSON = JSON.stringify(variables);

  useEffect(() => {
    ((async () => {
      const result = await request(query, JSON.parse(variablesJSON));

      setState(result.data);

      stateRef.current = result.data;
    })());
  }, [query, variablesJSON]);

  const handleMessage = useCallback((event: CustomEvent) => {
    const isDirty = updateState(stateRef.current, event.detail.value);

    if (isDirty) {
      setState({ ...stateRef.current });
    }
  }, []);

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
