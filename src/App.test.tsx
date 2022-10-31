import React from "react";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TodoList from "./components/TodoList";
import TodoEntry from "./components/TodoEntry/TodoEntry";
import TodoForm from "./components/TodoForm";
import userEvent from "@testing-library/user-event";
import { click } from "@testing-library/user-event/dist/click";

afterEach(cleanup);

describe("TodoEntry component", () => {
  it("should respond to checkbox click", () => {
    const setTodoEntries = jest.fn();
    const { getByTestId } = render(
      <TodoEntry
        content={"test"}
        completed={false}
        index={0}
        setTodoEntries={setTodoEntries}
      />
    );

    fireEvent.click(getByTestId("todo-checkbox"));
    expect(setTodoEntries).toHaveBeenCalledTimes(1);
  });
});

describe("TodoList component", () => {
  it("should update checkbox value on click", () => {
    const { getAllByTestId } = render(
      <TodoList defaultTodoEntries={[{ completed: true, content: "test" }]} />
    );

    const todoCheckboxes = getAllByTestId(
      "todo-checkbox"
    ) as HTMLInputElement[];

    todoCheckboxes.forEach((element: HTMLInputElement) => {
      const checkedInitial = element.checked;
      fireEvent.click(element);
      expect(element.checked).toBe(!checkedInitial);
      fireEvent.click(element);
      expect(element.checked).toBe(checkedInitial);
    });
  });

  it("should set class name of text based on checkbox value", () => {
    const { getByText } = render(
      <TodoList
        defaultTodoEntries={[
          { completed: true, content: "test1" },
          { completed: false, content: "test2" },
        ]}
      />
    );

    expect(getByText(/test1/i).getAttribute("class")).toBe(
      "todo-entry__text_checked"
    );
    expect(getByText(/test2/i).getAttribute("class")).toBe("todo-entry__text");
  });

  it("should add new entry with proper value on button click", () => {
    const { getByTestId } = render(<TodoList defaultTodoEntries={[]} />);

    const inputElement = getByTestId("form-input") as HTMLInputElement;
    const buttonElement = getByTestId("form-button");

    userEvent.type(inputElement, "Hello");
    fireEvent.click(buttonElement);
    expect(getByTestId("todo-entry")).toBeTruthy();
    expect(getByTestId("todo-text")).toHaveTextContent(/^Hello$/);
  });
});

describe("TodoForm component", () => {
  it("should properly change input", () => {
    const { getByTestId } = render(<TodoForm setTodoEntries={jest.fn()} />);

    const inputElement = getByTestId("form-input");

    userEvent.type(inputElement, "Hello");
    expect(inputElement.getAttribute("value")).toBe("Hello");

    userEvent.type(inputElement, " man");
    expect(inputElement.getAttribute("value")).toBe("Hello man");
  });

  it("should have button disabled when input is empty", () => {
    const { getByTestId } = render(<TodoForm setTodoEntries={jest.fn()} />);

    const buttonElement = getByTestId("form-button");

    expect(buttonElement).toBeDisabled();

    const inputElement = getByTestId("form-input");
    userEvent.type(inputElement, "Hello");

    expect(buttonElement).not.toBeDisabled();
  });

  it("should clear input on button click", () => {
    const { getByTestId } = render(<TodoForm setTodoEntries={jest.fn()} />);
    const buttonElement = getByTestId("form-button");
    const inputElement = getByTestId("form-input");

    userEvent.type(inputElement, "Hello");
    fireEvent.click(buttonElement);
    expect(inputElement.getAttribute("value")).toBe("");
  });
});
