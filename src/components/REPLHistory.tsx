import { table } from "console";
import "../styles/main.css";
import { useState } from "react";

/**
 * Interface for REPLHistory showing what props it takes in
 */
interface REPLHistoryProps {
  history: [string, string | string[][]][];
  mode: string;
}

/**
 * Renders the REPL History interfaace
 * @param props Takes in the props passed into the REPLHistory class
 * @returns Returns the rendering of the REPL History interface and prints out the
 * history depending on its contents and the current mode
 */
export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history" aria-label="history">
      {props.history.map(([command, output], index) =>
        props.mode == "brief" ? (
          <p>{command}</p>
        ) : (
          <p>
            {"Command: " + command}
            <br></br>
            {"Output: "}
            {typeof output == "string" ? (
              output
            ) : (
              <table aria-label={"result table " + index}>
                {output.map((line) => (
                  <tr>
                    {line.map((val) => (
                      <td>{val}</td>
                    ))}
                  </tr>
                ))}
              </table>
            )}
          </p>
        )
      )}
    </div>
  );
}
