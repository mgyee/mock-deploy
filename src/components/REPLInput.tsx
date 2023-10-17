import "../styles/main.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";

/**
 * Interface defining the props that REPLInput takes in
 */
interface REPLInputProps {
  history: [string, string | string[][]][];
  setHistory: Dispatch<SetStateAction<[string, string | string[][]][]>>;
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
  csv: string[][];
  setCsv: Dispatch<SetStateAction<string[][]>>;
  csvMap: Map<string, string[][]>;
  searchResultMap: Map<string, string[][]>;
}
export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");

  /**
   * Function to handle tthe "load_file" command
   * @param args The arguments passed into the command input box
   * @returns Returns the output depending on whether the csv file is valid or not,
   * and whether the arguments are valid or not
   */
  function handleLoadCsv(args: string[]) {
    if (args.length == 2) {
      const filepath = args[1];
      const data = props.csvMap.get(filepath);
      if (data) {
        if (data.length == 0) {
          return "CSV file given is empty";
        }
        props.setCsv(data);
        return "Successfully loaded " + filepath;
      } else {
        return "File not found: " + filepath;
      }
    } else {
      return "Usage: load_file <filepath>";
    }
  }

  /**
   * Function to handle the "view" command
   * @returns Returns the csv current loaded (if there is one, otherwise an error)
   */
  function handleViewCsv() {
    return props.csv.length == 0 ? "Csv not loaded" : props.csv;
  }

  /**
   * Function to handle the "search" command
   * @param args The arguments passed into the command input box
   * @returns Returns the output depending on whether the arguments are valid or not,
   * and whether we were able to find a value
   */
  function handleSearchCsv(args: string[]) {
    if (props.csv.length == 0) {
      return "Csv not loaded";
    }
    if (args.length >= 2) {
      const data = props.searchResultMap.get(args.slice(1).join(" "));
      if (data) {
        return data;
      } else {
        return "Search result was not found";
      }
    } else {
      return "Usage: search <value> [column index]/[column name]";
    }
  }

  /**
   * Function to handle when the button is clicked or the enter key is pressed.
   * @param commandString The command string given from the command input box
   */
  function handleSubmit(commandString: string) {
    let output: string | string[][] = "";
    if (commandString == "mode") {
      props.setMode(props.mode == "brief" ? "verbose" : "brief");
    } else {
      if (commandString == "view") {
        output = handleViewCsv();
      } else {
        const args = commandString.split(" ");
        if (args[0] == "load_file") {
          output = handleLoadCsv(args);
        } else if (args[0] == "search") {
          output = handleSearchCsv(args);
        } else {
          output = "Invalid command input";
        }
      }
      props.setHistory([...props.history, [commandString, output]]);
    }
    setCommandString("");
  }

  /**
   * Renders the REPL Input interface
   */
  return (
    <div
      className="repl-input"
      onKeyDown={(key) =>
        key.code == "Enter" ? handleSubmit(commandString) : null
      }
    >
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      <button onClick={() => handleSubmit(commandString)}>
        Mode: {props.mode}
      </button>
    </div>
  );
}
