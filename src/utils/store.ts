import { useCallback, useEffect, useRef, useState } from "react";

function createStore<TData>(initialData: TData) {
  let store: TData = { ...initialData };

  const dispatch = (reducer: (state: TData) => TData) => {
    store = reducer(store);

    document.dispatchEvent(new CustomEvent("store"));
  };

  function useStore<A = void, B = void, C = void>(
    // selectors: [((state: TData) => A)?, ((state: TData) => B)?, ((state: TData) => C)?] = []
    selector: ((state: TData) => [A?, B?, C?])
  ) {
    const [state, setState] = useState<[A, B, C]>(
      // selectors.map(selector => selector?.(store)) as [A, B, C]
      selector?.(store) as [A, B, C]
    );

    const stateRef = useRef(state);

    const handleMessage = useCallback(() => {
      // const updatedState = selectors.map(selector => selector?.(store)) as [A, B, C];
      const updatedState = selector?.(store) as [A, B, C];

      if (updatedState.some((value, index) => value !== stateRef.current[index])) {
        setState(updatedState);

        stateRef.current = updatedState;
      }
      // selectors won't change, so no need for dependency
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      document.addEventListener("store", handleMessage);

      return () => {
        document.removeEventListener("store", handleMessage);
      };
    }, [handleMessage]);

    return { state, dispatch };
  }

  return useStore;
}

export {
  createStore
};
