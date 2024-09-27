import { useCallback, useEffect, useState } from 'react';

function createStore(initialData) {
  let store = { ...initialData };

  const dispatch = reducer => {
    store = reducer(store);

    document.dispatchEvent(new CustomEvent('store'));
  };

  function useStore(selectors) {
    const [state, setState] = useState(selectors.map(selector => selector(store)));

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

    return [state, dispatch];
  }

  return useStore;
}

//

const useStore = createStore({
  todos: [{
    title: "abc", completed: false
  }],
  date: Date.now(),
});

const addTodo = title => state => ({
  ...state,
  todos: [
    ...state.todos,
    { title, completed: false }
  ]
});

const completeTodo = title => state => ({
  ...state,
  todos: state.todos.map(todo => todo.title === title
    ? { ...todo, completed: true }
    : todo)
});

const setDate = date => state => ({
  ...state,
  date
});

//

function App() {
  console.log('App()');

  const [[todos], dispatch] = useStore([state => state.todos]);

  return (
    <>
      <button onClick={() => dispatch(setDate(Date.now()))}>
        Set Date
      </button>
      &nbsp;
      <button onClick={() => dispatch(addTodo(Date.now().toString(36)))}>
        Add Todo
      </button>
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
    </>
  );
}

export default App;
