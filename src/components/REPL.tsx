import { useState } from "react";
import "../styles/main.css";
import { REPLHistory } from "./REPLHistory";
import { REPLInput } from "./REPLInput";

/**
 * Renders our main REPL class
 * @returns Returns the rendering of all the components in REPl including
 * ControlledInput, REPLHistory and REPLInput depending on the props which
 * we instantiate and define in this class, and pass to the other classes
 */
export default function REPL() {
  // Initializing our history state and setHistory method
  const [history, setHistory] = useState<[string, string | string[][]][]>([]);

  // Initializing our mode state an setMode methods
  const [mode, setMode] = useState<string>("brief");

  // Instantiating map that contains our mocked CSV data
  const csvMap = new Map<string, string[][]>();

  csvMap.set("numbers", [
    ["ID1", "ID2", "ID3"],
    ["1", "2", "3"],
    ["4", "5", "6"],
  ]);

  csvMap.set("oneColumn", [["Test"], ["Test1"], ["Test2"]]);

  csvMap.set("empty", []);

  csvMap.set("unequalRows", [
    ["1", "2", "3", "4"],
    ["5", "7"],
    ["8", "9", "10"],
  ]);

  csvMap.set("dol_ri_earnings_disparity", [
    [
      "State",
      "Data Type",
      "Average Weekly Earnings",
      "Number of Workers",
      "Earnings Disparity",
      "Employed Percent",
    ],
    ["RI", "White", "$1,058.47 ", "395773.6521", "$1.00", "75%"],
    ["RI", "Black", "$770.26", "30424.80376", "$0.73", "6%"],
    [
      "RI",
      "Native American/American Indian",
      "$471.07",
      "2315.505646",
      "$0.45",
      "0%",
    ],
    ["RI", "Asian-Pacific Islander", "$1,080.09", "18956.71657", "$1.02", "4%"],
    ["RI", "Hispanic/Latino", "$673.14", "74596.18851", "$0.64", "14%"],
    ["RI", "Multiracial", "$971.89", "8883.049171", "$0.92", "2%"],
  ]);

  // Instantating the searchMap that contains our mocked search results
  const searchResultsMap = new Map<string, string[][]>();
  searchResultsMap.set("Black", [
    ["RI", "Black", "$770.26", "30424.80376", "$0.73", "6%"],
  ]);
  searchResultsMap.set("6% Employed Percent", [
    ["RI", "Black", "$770.26", "30424.80376", "$0.73", "6%"],
  ]);
  searchResultsMap.set("6% 5", [
    ["RI", "Black", "$770.26", "30424.80376", "$0.73", "6%"],
  ]);
  searchResultsMap.set("1 ID1", [["1", "2", "3"]]);
  searchResultsMap.set("1", [["1", "2", "3", "4"]]);
  /*
  Instantiating our csv state and setCSV method. 
  This will hold the contents of our loaded CSV.
  */
  const [csv, setCsv] = useState<string[][]>([]);

  // Renders the REPL interface depending on the props we defined above
  return (
    <div className="repl">
      <REPLHistory history={history} mode={mode} />
      <hr></hr>
      <REPLInput
        history={history}
        setHistory={setHistory}
        mode={mode}
        setMode={setMode}
        csvMap={csvMap}
        searchResultMap={searchResultsMap}
        csv={csv}
        setCsv={setCsv}
      />
    </div>
  );
}
