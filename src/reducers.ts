// array at(2)
// array insert(2, 'a')(array)
// array append('b')
// array appendAll(['b', 'c'])
// array insetAll(2, [4, 5])([1, 2])
// array update(2, (count = 0 => count + 1)
// array replace(2, 'b')(array)
// array remove(2)
// array removeAll([2, 3])(array)
// array removeAll(range(2, 3))(array)
// array concat(array, array)
// array indexOf('foo'))
// array reverse(array)
// array splitAt, splitEvery
// take, drop, includes, sort, sortBy, group, groupBy
// indexOf, find, 
// without
//
// object at('a')
// object merge(object, object)
// object mergeAll(object, [{}, {}])
// object delete('a')
// object update('a', (count = 0 => count + 1)
// object replace, includes, transpose
//
// stream select selectAll, filter, reduce, zip, every, some
// stream range(1, 10)

// update[Array] = 

const merge = <T>(item2: Partial<T>) => (item: T) => {
  return { ...item, ...item2 };
};

const update = <TValue, TData>(key: number, updater: (item: TValue, data?: TData) => TValue) =>
  (items: TValue[], data?: TData) => {
    return items.map((item, index) => index === key
      ? updater(item, data)
      : item
    );
  };

const updateObject = <K extends string, V>(key: K, updater: (item: V) => V) => (items: { [key: string]: V; }) => {
  return { ...items, [key]: updater(items[key]) };
};

update(0, (todo: Todo) => ({ ...todo, completed: true }));

update(0, merge({ completed: true }));

const remove = (id: number) => (todos: Todo[]) => {
  return todos.filter(todo => todo.id !== id);
};

//

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

type State = {
  todos: Todo[];
  date: number;
};

const updateTodos = (todosReducer: (todos: Todo[], state: State) => Todo[]) => (state: State) => ({
  ...state, todos: todosReducer(state.todos, state)
});

const updateTodo = (id: number, updater: (todo: Todo, state?: State) => Todo) =>
  (todos: Todo[], state?: State) => {
    const index = todos.findIndex(todo => todo.id === id);

    return update(index, updater)(todos, state);
  };

//

const setDate = (date: number) => (state: State) => ({
  ...state, date
});

const addTodo = (title: string | number) => updateTodos((todos, state) => ([
  ...todos, {
    id: Date.now(),
    title: state.date + " : " + title.toString(),
    completed: false
  }
]));

const completeTodo = (id: number) => updateTodos((todos, state) => (
  updateTodo(id, merge<Todo>({ completed: true }))(todos)
));

export {
  setDate,
  updateTodos,
  addTodo,
  updateTodo,
  completeTodo,
};
