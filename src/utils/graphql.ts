import { useEffect, useRef, useState } from "react";
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

function useQuery(query, variables = {}, types) {
  const { state: data, dispatch } = useStore(state => {
    return types.map(type => state.types[type]);
  });

  const [state, setState] = useState();

  console.log(data);

  useEffect(() => {
    ((async () => {
      const result = await request(query);

      setState(result);

      // dispatch(updateData(result.data));
    })());
  }, [dispatch, query]);

  const handleMessage = () => {
    console.log("useQuery handleMessage");
  };

  useEffect(() => {
    document.addEventListener("graphql", handleMessage);
  }, []);

  return {
    data: state?.data
  };
}

//

const createItem = (type: string, value) => state => {
  return ({
    ...state,
    types: {
      ...state.types,
      [type]: value
    }
    // data: {
    //   ...state.data,
    //   [field]: [...state.data[field], item]
    // },
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
function useMutation(mutation, actions, types) {
  const { dispatch } = useStore(state => []);

  function callback() {
    ((async () => {
      const result = await request(mutation, {}, "/addTodo.json");

      // We don't know which property to update
      Object.values(result.data).forEach((value, index) => {
        switch (actions[index]) {
          case "create":
            dispatch(createItem(types[index], value));

            console.log("1", types[index]);
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
