import { makeExecutableSchema } from 'graphql-tools';
import { merge } from "lodash";

import * as todos from "./todos";

const rootTypeDefs = `
  type Query {
    _:Boolean
  }
  type Mutation {
    _:Boolean
  }
  type Subscription {
    _:Boolean
  }
`;
  
const typeDefs = [
  rootTypeDefs,
  todos.typeDefs
];

const resolvers = merge(
  todos.resolvers,
);

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
