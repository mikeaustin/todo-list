// Instead of calling useSelector() for each piece of data in Redux for example,
// this prototype allows you to destructure data by passing all selectors to a
// useStore() function. The createStore() function allows you to pass in initial
// data, and returns the useStore() hook to be used in components.

import { useCallback, useEffect, useState } from 'react';

function createStore<TData>(initialData: TData) {
  let store: TData = { ...initialData };

  const dispatch = (reducer: (state: TData) => TData) => {
    store = reducer(store);

    document.dispatchEvent(new CustomEvent('store'));
  };

  function useStore<A, B>(selectors: [] | [(state: TData) => A] | [(state: TData) => A, ((state: TData) => B)] = []) {
    const [state, setState] = useState<[A] | [A, B]>(selectors.map(selector => selector(store)));

    const handleMessage = useCallback(() => {
      const newState = selectors.map(selector => selector(store));

      if (newState.some((value, index) => value !== state[index])) {
        setState(newState);
      }
    }, [selectors, state]);

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

function TodoList() {
  console.log('TodoList()');

  const { state: [todos], dispatch } = useStore([
    state => state.todos,
    state => state.date,
  ]);

  // console.log(date);

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

function App() {
  console.log('App()');

  const { dispatch } = useStore();

  return (
    <>
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
