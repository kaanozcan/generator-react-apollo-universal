import React from "react";
import Todo from "./index";
import { render } from "@testing-library/react";

describe("<Todo />", () => {
  it("should display title", () => {
    const title = "todo title";
    const { getByText } = render(<Todo title={title} />);

    expect(getByText(title)).toBeInTheDocument();
  });
});
