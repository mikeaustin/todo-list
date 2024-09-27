import { useEffect, useState } from 'react';

function createStore(initialData) {
  var store = { ...initialData };

  const dispatch = reducer => {
    store = reducer(store);

    document.dispatchEvent(new CustomEvent('store'));
  };

  function useStore(selector) {
    const [state, setState] = useState({ todos: selector(store) });

    const handleMessage = () => {
      if (store.todos !== state.todos) {
        setState({ todos: selector(store) });
      }
    };

    useEffect(() => {
      document.addEventListener('store', handleMessage);

      return () => {
        document.removeEventListener('store', handleMessage);
      };
    }, []);

    return [state, dispatch];
  }

  return useStore;
}

const useStore = createStore({
  todos: [],
});

const addTodo = title => state => ({
  ...state,
  todos: [
    ...state.todos,
    { title }
  ]
});

function App() {
  const [{ todos }, dispatch] = useStore(state => state.todos);

  return (
    <>
      <button onClick={() => dispatch(addTodo(Date.now().toString(36)))}>
        Add Todo
      </button>
      <ul>
        {todos.map(todo => (
          <li key={todo.title}>{todo.title}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
