import { createStore } from "./utils/store";

const useStore = createStore({
  todos: [{
    title: "abc",
    completed: false
  }],
  date: Date.now(),
});

export {
  useStore
};
