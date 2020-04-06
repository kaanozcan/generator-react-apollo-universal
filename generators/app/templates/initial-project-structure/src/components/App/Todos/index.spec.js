import React from "react";
import { MockedProvider } from "@apollo/react-testing";
import { render, act } from "@testing-library/react";
import wait from "@lib/utils/test-utils/wait";
import Todos, { TODOS } from "./index";

const queryMocks = [{
  request: {
    query: TODOS
  },
  result: {
    data: {
        todos: [{
        title: "title 1",
        completed: false
      }, {
        title: "title 2",
        completed: false
      }]
    }
  }
}];

describe("<Todos />", () => {

  it("should render loading indicator", () => {
    const result = render(
      <MockedProvider mocks={queryMocks} addTypename={false}>
        <Todos />
      </MockedProvider>,
    );

    expect(result.getByText("Loading...")).toBeInTheDocument();

  });

  it("should render <Todo /> components", async () => {

    const result = render(
      <MockedProvider mocks={queryMocks} addTypename={false}>
        <Todos />
      </MockedProvider>,
    );

    await act(() => wait(0));

    queryMocks[0].result.data.todos.forEach(({ title }) => {
      expect(result.getByText(title)).toBeInTheDocument();
    });

  });

});
