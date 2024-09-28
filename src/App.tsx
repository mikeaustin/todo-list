// Instead of calling useSelector() for each piece of data in Redux for example,
// this prototype allows you to destructure data by passing all selectors to a
// useStore() function. The createStore() function allows you to pass in initial
// data, and returns the useStore() hook to be used in components.

import React, { useCallback, useEffect, useRef, useState } from 'react';

function createStore<TData>(initialData: TData) {
  let store: TData = { ...initialData };

  const dispatch = (reducer: (state: TData) => TData) => {
    store = reducer(store);

    document.dispatchEvent(new CustomEvent('store'));
  };

  function useStore<A = void, B = void, C = void>(
    selectors: [((state: TData) => A)?, ((state: TData) => B)?, ((state: TData) => C)?] = []
  ) {
    const [state, setState] = useState<[A, B, C]>(
      selectors.map(selector => selector?.(store)) as [A, B, C]
    );

    const stateRef = useRef(state);

    const handleMessage = useCallback(() => {
      const updatedState = selectors.map(selector => selector?.(store)) as [A, B, C];

      if (updatedState.some((value, index) => value !== stateRef.current[index])) {
        setState(updatedState);

        stateRef.current = updatedState;
      }
    }, []); // selectors won't change

    useEffect(() => {
      document.addEventListener('store', handleMessage);

      return () => {
        document.removeEventListener('store', handleMessage);
      };
    }, [handleMessage]);

    return { state, dispatch };
  }

  return useStore;
}

//

type State = {
  todos: {
    title: string;
    completed: boolean;
  }[];
  date: number;
};

const useStore = createStore({
  todos: [{
    title: "abc", completed: false
  }],
  date: Date.now(),
});

const addTodo = (title: string | number) => (state: State) => ({
  ...state,
  todos: [
    ...state.todos,
    { title: title.toString(), completed: false }
  ]
});

const completeTodo = (title: string) => (state: State) => ({
  ...state,
  todos: state.todos.map(todo => todo.title === title
    ? { ...todo, completed: true }
    : todo)
});

const setDate = (date: number) => (state: State) => ({
  ...state,
  date
});

function TodoList$() {
  console.log('TodoList()');

  const { state: [todos], dispatch } = useStore([
    state => state.todos,
  ]);

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.title}> {todo.title} {todo.completed && 'completed'}
          {!todo.completed && (
            <button onClick={() => dispatch(completeTodo(todo.title))}>
              Complete
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

const TodoList = React.memo(TodoList$);

function App() {
  console.log('App()');

  const { state: [date], dispatch } = useStore([
    state => state.date
  ]);

  return (
    <>
      {date}
      <br />
      <button onClick={() => dispatch(setDate(Date.now()))}>
        Set Date
      </button>
      &nbsp;
      <button onClick={() => dispatch(addTodo(Date.now() % 100000))}>
        Add Todo
      </button>
      <TodoList />
    </>
  );
}

export default App;
