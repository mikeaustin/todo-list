import { createStore } from "./utils/store";

const useStore = createStore({
  todos: [{
    id: Date.now(),
    title: "abc",
    completed: false
  }],
  date: Date.now(),
});

export {
  useStore
};
