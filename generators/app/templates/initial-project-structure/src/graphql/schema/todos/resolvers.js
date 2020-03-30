export const Query = {
  todos: (parent, args, { dataSources }) => {
    return dataSources.todosAPI.getTodos();
  }
}
