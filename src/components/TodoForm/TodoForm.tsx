import React from "react";
// Styles
import "./TodoForm.css";
// Types
import { TodoEntryInterface } from "../../utility/interfaces";
interface TodoFormProps {
  setTodoEntries: React.Dispatch<React.SetStateAction<TodoEntryInterface[]>>;
}

const TodoForm: React.FunctionComponent<TodoFormProps> = (props) => {
  const [inputData, setInputData] = React.useState("");

  // Handles controlled input
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setInputData(event.target.value);
  };

  // Adds new entry to list
  const handleButtonClick = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    props.setTodoEntries((prevTodoEntries) => {
      return [...prevTodoEntries].concat([
        { completed: false, content: inputData },
      ]);
    });
    setInputData("");
  };

  return (
    <form className="todos__form" onSubmit={handleButtonClick}>
      <input
        className="todos__input"
        data-testid="form-input"
        onChange={handleInputChange}
        value={inputData}
      ></input>
      <button
        className="todos__new-button"
        data-testid="form-button"
        disabled={inputData === "" ? true : false}
      >
        +
      </button>
    </form>
  );
};

export default TodoForm;
