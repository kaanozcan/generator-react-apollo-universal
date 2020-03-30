const { RESTDataSource } = require('apollo-datasource-rest');

export class TodosAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://jsonplaceholder.typicode.com';
  }

  getTodos () {
    return this.get("todos");
  }
}
