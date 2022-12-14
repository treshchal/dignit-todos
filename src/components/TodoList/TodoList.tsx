import React from "react";
import { v4 as uuidv4 } from "uuid";
// Styles
import "./TodoList.css";
// Components
import TodoEntry from "../TodoEntry/TodoEntry";
import TodoForm from "../TodoForm/TodoForm";
// Types
import { TodoEntryInterface } from "../../utility/interfaces";
import { ViewMode } from "../../utility/enums";

interface TodoListProps {
  test: boolean;
  defaultTodoEntries: TodoEntryInterface[];
}

interface ButtonData {
  value: string;
  mode: ViewMode;
}

const TodoList: React.FunctionComponent<TodoListProps> = (props) => {
  const [todoEntries, setTodoEntries] = React.useState<TodoEntryInterface[]>(
    (!props.test && JSON.parse(localStorage.getItem("dignitTodoSaveData")!)) ||
      props.defaultTodoEntries
  );

  React.useEffect(() => {
    localStorage.setItem("dignitTodoSaveData", JSON.stringify(todoEntries));
  }, [todoEntries]);

  const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.ALL);

  // Set view mode
  const switchViewMode = (mode: ViewMode): void => {
    setViewMode(mode);
  };

  // Create list of todo entries from state
  const todoEntriesElements = todoEntries
    .filter((todoEntry) => {
      if (
        (todoEntry.completed && viewMode === ViewMode.ACTIVE) ||
        (!todoEntry.completed && viewMode === ViewMode.COMPLETED)
      )
        return false;
      // else
      return true;
    })
    .map((todoEntry, index) => (
      <TodoEntry
        key={uuidv4()}
        content={todoEntry.content}
        completed={todoEntry.completed}
        index={index}
        setTodoEntries={setTodoEntries}
      />
    ));

  // Count uncompleted todos
  const activeTodosAmount: number = todoEntries.reduce(
    (totalActive: number, entry: TodoEntryInterface) => {
      return entry.completed ? totalActive : ++totalActive;
    },
    0
  );

  // Button data for button elements
  const buttonData: ButtonData[] = [
    { value: "All", mode: ViewMode.ALL },
    { value: "Active", mode: ViewMode.ACTIVE },
    { value: "Completed", mode: ViewMode.COMPLETED },
  ];

  // Create button elements from button data
  const buttonElements = buttonData.map((data) => {
    return (
      <button
        key={uuidv4()}
        data-testid={"view-mode-button-" + data.value}
        className={
          "todos__view-button" + (viewMode === data.mode ? "_active" : "")
        }
        disabled={viewMode === data.mode}
        onClick={() => switchViewMode(data.mode)}
      >
        {data.value}
      </button>
    );
  });

  // Deletes completed entries from todoEntries state
  const clearCompleted = (): void => {
    setTodoEntries((prevTodoEntries) => {
      return [...prevTodoEntries].reduce(
        (
          uncompletedEntries: TodoEntryInterface[],
          prevTodoEntry: TodoEntryInterface
        ) => {
          if (!prevTodoEntry.completed)
            return uncompletedEntries.concat([prevTodoEntry]);
          // else
          return uncompletedEntries;
        },
        []
      );
    });
  };

  return (
    <main className="todos">
      <TodoForm setTodoEntries={setTodoEntries} />
      <ul className="todos__list" data-testid="todo-list">{todoEntriesElements}</ul>
      <span className="todos__items-left" data-testid="active-amount-text">
        {activeTodosAmount} items left
      </span>
      <div className="todos__view-button-container" >{buttonElements}</div>
      <button className="clear-button" data-testid="clear-completed-button" onClick={clearCompleted}>
        Clear completed
      </button>
    </main>
  );
};

export default TodoList;
