import "../styles/main.css";
import { Dispatch, SetStateAction } from "react";

/**
 * Interface defining what props ControlledInput takes in
 */
interface ControlledInputProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  ariaLabel: string;
}

/**
 * Takes in the props of Controlled Input and renders it onto the screen
 * depending on the props passed in
 * @param param0 Takes in the props of ControlledInput
 * @returns Renders the ControlledInput interface depending on the props
 */
export function ControlledInput({
  value,
  setValue,
  ariaLabel,
}: ControlledInputProps) {
  return (
    <input
      type="text"
      className="repl-command-box"
      value={value}
      placeholder="Enter command here!"
      onChange={(ev) => setValue(ev.target.value)}
      aria-label={ariaLabel}
    ></input>
  );
}
