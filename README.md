# Mock

https://github.com/cs0320-f23/mock-asing220-mgyee

Team Members: Matthias Yee (mgyee), Aryan Singh (asing220)

Time to Complete Project: 10 Hours

## Design Choices + Project Description

This is a frontend REPL used to view and search CSV files provided by the user. It also tracks the history of previous inputs and outputs. Apart from the basic React code, we have 4 main classes which handles our front-end logic: `ControlledInput.tsx`, `REPL.tsx`, `REPLHistory.tsx` and `REPLinput.tsx`.

The `REPL.tsx` file contains all of our definitions and instantiations of the props which we pass in later on to the other classes. It also contains our mocked data which we also pass in as props to the other classes.

The `ControlledInput.tsx` contains our interface for the command box where the user actually types in the commands.

In the `ReplInput.tsx` file, we allow the user to submit their commands either by pressing a button or hitting the enter key. Depending on their input, there are 4 possible scenarios that can occur which are highlighted in the Usage section. If an input is given that is not part of those 4 commands, an error is printed to the history signifying that an invalid command input was created.

In order to keep track of the history, we defined our history prop in `ReplHistory.tsx` of type `string, string | string[][]][]`. Essentially, it is an array of tuples where each tuples consists of a string and a union type of `string | string[][]` where it can be different depending on the input given. We ensure that the history is traversed in order from earliest command to latest by iterating it from the first index to the last since we add the commands to the history when it is first entered.

Csv output is displayed in a table for readability when the user inputs view or search csv. Other output is displayed as a string. We are able to do this by using a union type for the ouput of `string | string[][]`.

The way we dealt with different modes that while iterating over our history array in ReplHistory, if the current mode (which we passed in as a prop) is brief, we simply print the command a.k.a the first part of the tuple, otherwise we print both parts of the tuple.

## Errors

- None

## Usage

To use the project:

    npm run start

Now use a web browser to navigate to:

    http://localhost:8000

From here we have a REPL that has 4 commands:

- ### Mode

  - This is used to switch the mode of the history from brief (only inputs) to verbose (inputs and outputs) and back

example:

    mode

- ### load_file

  - This is used to load in CSV file
  - Parameters:
    - `csv filename`

example:

    load_file dol_ri_earnings_disparity

- ### view
  - This is used to view in a CSV file that was loaded in

example:

    view

- ### search
  - This is used to search the loaded in csv
  - Parameters:
    - `value`: the value you want to search for
    - `column`: the index or name of the column you want to search in (optional)

example:

    search 6% Employed Percent

## Tests

We used mocked CSVfiles, and search results which we stored in a map from strings to string arrays i.e. `Map<string, string[][]>`. These were instantiated in `Repl.tsx` and were pased as props to `REPLInput.tsx` and `REPLHistory.tsx`. Some example tests we made were:

- Testing for when a search value does not exist in our mocked data
  - This should return an error string saying that it was not found which we can check by going to verbose mode and checking the text of ReplHistory
- Testing when the csv file is empty
  - In our design, we simply chose to treat it as if a csv file was not loaded so it should return an output string saying CSV not loaded
- Testing when we view or search without loading the CSV first
  - This should return an error in our history
- Testing whether pressing Enter has the same effect as pressing the button
- Testing whether inputting mode changes the mode from brief to verbose and back
- Testing whether loading different files twice ensures only one file is loaded at a time.
- Testing whether our command box works as expected
- Testing whether our history gets correctly updated when submitted, and whether the history is in order of when it was submitted.

For more information on our tests, you can see all the specific ones we have defined in our `/tests/mock_tests` folder located in `App.spec.ts`

### To run the tests:

    npx playwright test

To run the tests with the UI, you can run:

    npx playwright test --ui
