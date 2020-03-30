export const typeDefs = `
  type Todo {
    id: Int
    userId: Int
    title: String
    completed: Boolean
  }

  extend type Query {
    todos: [Todo]
  }

`;
