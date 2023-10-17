import { test, expect } from "@playwright/test";

/*
  A function that we run before each function to ensure
  that our connection to localhost works and all of our preliminary
  items such as button and command inputs are visible on the screen
 */
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await expect(page.getByLabel("Command input")).toBeVisible();
  await expect(page.getByRole("button")).toBeVisible();
});

test("after I type into the input box, its text changes", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("Hello");
  const mock_input = `Hello`;
  await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
});

test("after I click the button, the history gets updated", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Mode: brief" })).toBeVisible();
  await page.getByLabel("Command input").fill("Hello");
  await expect(page.getByLabel("Command input")).toHaveValue("Hello");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByRole("button", { name: "Mode: brief" })).toBeVisible();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText("Hello");
});

test("load_file and view", async ({ page }) => {
  await page
    .getByLabel("Command input")
    .fill("load_file dol_ri_earnings_disparity");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file dol_ri_earnings_disparityOutput: Successfully loaded dol_ri_earnings_disparity"
  );

  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  const table = await page.getByLabel("result table 1");
  await expect(table).toBeVisible();

  const rows = await table.locator("tr");
  const rowsCount = await rows.count();
  await expect(rowsCount).toBe(7);

  const headersData = [
    "State",
    "Data Type",
    "Average Weekly Earnings",
    "Number of Workers",
    "Earnings Disparity",
    "Employed Percent",
  ];
  const firstRowData = [
    "RI",
    "White",
    "$1,058.47",
    "395773.6521",
    "$1.00",
    "75%",
  ];
  const headers = await rows.nth(0);
  const firstRow = await rows.nth(1);
  for (var i = 0; i < 6; i++) {
    const text = await headers.locator("td").nth(i).innerText();
    await expect(text).toBe(headersData[i]);
  }
  for (var i = 0; i < 6; i++) {
    const text = await firstRow.locator("td").nth(i).innerText();
    await expect(text).toBe(firstRowData[i]);
  }
});

test("load_file fail", async ({ page }) => {
  await page.getByLabel("Command input").fill("load_file hello");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText("load_file hello");
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file helloOutput: File not found: hello"
  );
});

test("view without csv", async ({ page }) => {
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText("view");
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("history")).toContainText(
    "Command: viewOutput: Csv not loaded"
  );
});

test("search without csv", async ({ page }) => {
  await page.getByLabel("Command input").fill("search");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText("search");
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(
    page.getByRole("button", { name: "Mode: verbose" })
  ).toBeVisible();
  await expect(page.getByLabel("history")).toContainText(
    "Command: searchOutput: Csv not loaded"
  );
});

test("after I input mode, it updates the mode", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Mode: brief" })).toBeVisible();
  await page.getByLabel("Command input").fill("mode");
  await expect(page.getByLabel("Command input")).toHaveValue("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(
    page.getByRole("button", { name: "Mode: verbose" })
  ).toBeVisible();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText("");
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByRole("button", { name: "Mode: brief" })).toBeVisible();
});

test("after I press enter, the history gets updated", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Mode: brief" })).toBeVisible();
  await page.getByLabel("Command input").fill("hello");
  await expect(page.getByLabel("Command input")).toHaveValue("hello");
  await page.getByLabel("Command input").press("Enter");
  await expect(page.getByRole("button", { name: "Mode: brief" })).toBeVisible();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText("hello");
});

test("after I view, the table gets loaded", async ({ page }) => {
  await page
    .getByLabel("Command input")
    .fill("load_file dol_ri_earnings_disparity");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );

  //change mode
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(
    page.getByRole("button", { name: "Mode: verbose" })
  ).toBeVisible();
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file dol_ri_earnings_disparityOutput: Successfully loaded dol_ri_earnings_disparity"
  );

  //view_csv
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  const table = await page.getByLabel("result table 1");
  await expect(table).toBeVisible();

  const rows = await table.locator("tr");
  const rowsCount = await rows.count();
  await expect(rowsCount).toBe(7);

  const headersData = [
    "State",
    "Data Type",
    "Average Weekly Earnings",
    "Number of Workers",
    "Earnings Disparity",
    "Employed Percent",
  ];
  const firstRowData = [
    "RI",
    "White",
    "$1,058.47",
    "395773.6521",
    "$1.00",
    "75%",
  ];
  const headers = await rows.nth(0);
  const firstRow = await rows.nth(1);
  for (var i = 0; i < 6; i++) {
    const text = await headers.locator("td").nth(i).innerText();
    await expect(text).toBe(headersData[i]);
  }
  for (var i = 0; i < 6; i++) {
    const text = await firstRow.locator("td").nth(i).innerText();
    await expect(text).toBe(firstRowData[i]);
  }
});

test("after I view, the table gets loaded even if I press enter", async ({
  page,
}) => {
  await page
    .getByLabel("Command input")
    .fill("load_file dol_ri_earnings_disparity");
  await page.getByLabel("Command input").press("Enter");
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );

  //change mode
  await page.getByLabel("Command input").fill("mode");
  await page.getByLabel("Command input").press("Enter");
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(
    page.getByRole("button", { name: "Mode: verbose" })
  ).toBeVisible();
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file dol_ri_earnings_disparityOutput: Successfully loaded dol_ri_earnings_disparity"
  );

  //view_csv
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  const table = await page.getByLabel("result table 1");
  await expect(table).toBeVisible();

  const rows = await table.locator("tr");
  const rowsCount = await rows.count();
  await expect(rowsCount).toBe(7);

  // const text = await rows.nth(0).locator("td").nth(0).innerText();
  // await expect(text).toBe("State");
  const headersData = [
    "State",
    "Data Type",
    "Average Weekly Earnings",
    "Number of Workers",
    "Earnings Disparity",
    "Employed Percent",
  ];
  const firstRowData = [
    "RI",
    "White",
    "$1,058.47",
    "395773.6521",
    "$1.00",
    "75%",
  ];
  const headers = await rows.nth(0);
  const firstRow = await rows.nth(1);
  for (var i = 0; i < 6; i++) {
    const text = await headers.locator("td").nth(i).innerText();
    await expect(text).toBe(headersData[i]);
  }
  for (var i = 0; i < 6; i++) {
    const text = await firstRow.locator("td").nth(i).innerText();
    await expect(text).toBe(firstRowData[i]);
  }
});

test("search with csv loaded", async ({ page }) => {
  await page
    .getByLabel("Command input")
    .fill("load_file dol_ri_earnings_disparity");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );

  //change mode
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(
    page.getByRole("button", { name: "Mode: verbose" })
  ).toBeVisible();
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file dol_ri_earnings_disparityOutput: Successfully loaded dol_ri_earnings_disparity"
  );

  //search
  await page.getByLabel("Command input").fill("search Black");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  const table = await page.getByLabel("result table 1");
  await expect(table).toBeVisible();

  const rows = await table.locator("tr");
  const rowsCount = await rows.count();
  await expect(rowsCount).toBe(1);
  const firstRowData = ["RI", "Black", "$770.26", "30424.80376", "$0.73", "6%"];
  const firstRow = await rows.nth(0);
  for (var i = 0; i < 6; i++) {
    const text = await firstRow.locator("td").nth(i).innerText();
    await expect(text).toBe(firstRowData[i]);
  }
});

test("search but value is not in csv", async ({ page }) => {
  await page
    .getByLabel("Command input")
    .fill("load_file dol_ri_earnings_disparity");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );

  //change mode
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(
    page.getByRole("button", { name: "Mode: verbose" })
  ).toBeVisible();
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file dol_ri_earnings_disparityOutput: Successfully loaded dol_ri_earnings_disparity"
  );

  //search
  await page.getByLabel("Command input").fill("search brown");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file dol_ri_earnings_disparityOutput: Successfully loaded dol_ri_earnings_disparityCommand: search brownOutput: Search result was not found"
  );

  await page.getByLabel("Command input").fill("search");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file dol_ri_earnings_disparityOutput: Successfully loaded dol_ri_earnings_disparityCommand: search brownOutput: Search result was not found"
  );
});

test("search wrong format", async ({ page }) => {
  await page
    .getByLabel("Command input")
    .fill("load_file dol_ri_earnings_disparity");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );

  //change mode
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(
    page.getByRole("button", { name: "Mode: verbose" })
  ).toBeVisible();
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file dol_ri_earnings_disparityOutput: Successfully loaded dol_ri_earnings_disparity"
  );

  //search
  await page.getByLabel("Command input").fill("search");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file dol_ri_earnings_disparityOutput: Successfully loaded dol_ri_earnings_disparityCommand: searchOutput: Usage: search <value> [column index]/[column name]"
  );
});

test("load wrong format", async ({ page }) => {
  await page.getByLabel("Command input").fill("load_file");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText("load_file");

  //change mode
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(
    page.getByRole("button", { name: "Mode: verbose" })
  ).toBeVisible();
  await expect(page.getByLabel("history")).toContainText("load_file");
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_fileOutput: Usage: load_file <filepath>"
  );
});

test("search with column identifier (with string and index)", async ({
  page,
}) => {
  await page
    .getByLabel("Command input")
    .fill("load_file dol_ri_earnings_disparity");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );

  //change mode
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(
    page.getByRole("button", { name: "Mode: verbose" })
  ).toBeVisible();
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file dol_ri_earnings_disparityOutput: Successfully loaded dol_ri_earnings_disparity"
  );

  //search
  await page.getByLabel("Command input").fill("search 6% Employed Percent");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  const table = await page.getByLabel("result table 1");
  await expect(table).toBeVisible();

  const rows = await table.locator("tr");
  const rowsCount = await rows.count();
  await expect(rowsCount).toBe(1);
  const firstRowData = ["RI", "Black", "$770.26", "30424.80376", "$0.73", "6%"];
  const firstRow = await rows.nth(0);
  for (var i = 0; i < 6; i++) {
    const text = await firstRow.locator("td").nth(i).innerText();
    await expect(text).toBe(firstRowData[i]);
  }

  await page.getByLabel("Command input").fill("search 6% 5");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  for (var i = 0; i < 6; i++) {
    const text = await firstRow.locator("td").nth(i).innerText();
    await expect(text).toBe(firstRowData[i]);
  }
});

test("load_file twice and view twice", async ({ page }) => {
  await page
    .getByLabel("Command input")
    .fill("load_file dol_ri_earnings_disparity");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file dol_ri_earnings_disparityOutput: Successfully loaded dol_ri_earnings_disparity"
  );

  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");

  const table = await page.getByLabel("result table 1");
  await expect(table).toBeVisible();

  const rows = await table.locator("tr");
  const rowsCount = await rows.count();
  await expect(rowsCount).toBe(7);

  const headersData = [
    "State",
    "Data Type",
    "Average Weekly Earnings",
    "Number of Workers",
    "Earnings Disparity",
    "Employed Percent",
  ];
  const firstRowData = [
    "RI",
    "White",
    "$1,058.47",
    "395773.6521",
    "$1.00",
    "75%",
  ];
  const headers = await rows.nth(0);
  const firstRow = await rows.nth(1);
  for (var i = 0; i < 6; i++) {
    const text = await headers.locator("td").nth(i).innerText();
    await expect(text).toBe(headersData[i]);
  }
  for (var i = 0; i < 6; i++) {
    const text = await firstRow.locator("td").nth(i).innerText();
    await expect(text).toBe(firstRowData[i]);
  }
  await page.getByLabel("Command input").fill("load_file numbers");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");

  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");

  const numbersTable = await page.getByLabel("result table 3");
  await expect(numbersTable).toBeVisible();

  const numberRow = await numbersTable.locator("tr");
  const secondRowsCount = await numberRow.count();
  await expect(secondRowsCount).toBe(3);

  const numbersFirstRowData = ["ID1", "ID2", "ID3"];
  const numbersSecondRowData = ["1", "2", "3"];
  const numbersFirstRow = await numberRow.nth(0);
  const numbersSecondRow = await numberRow.nth(1);
  for (var i = 0; i < 3; i++) {
    const text = await numbersFirstRow.locator("td").nth(i).innerText();
    await expect(text).toBe(numbersFirstRowData[i]);
  }
  for (var i = 0; i < 3; i++) {
    const text = await numbersSecondRow.locator("td").nth(i).innerText();
    await expect(text).toBe(numbersSecondRowData[i]);
  }
});

test("search with csv loaded then switch to brief mode", async ({ page }) => {
  await page
    .getByLabel("Command input")
    .fill("load_file dol_ri_earnings_disparity");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );

  //change mode
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(
    page.getByRole("button", { name: "Mode: verbose" })
  ).toBeVisible();
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file dol_ri_earnings_disparityOutput: Successfully loaded dol_ri_earnings_disparity"
  );

  //search
  await page.getByLabel("Command input").fill("search Black");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  const table = await page.getByLabel("result table 1");
  await expect(table).toBeVisible();

  const rows = await table.locator("tr");
  const rowsCount = await rows.count();
  await expect(rowsCount).toBe(1);
  const firstRowData = ["RI", "Black", "$770.26", "30424.80376", "$0.73", "6%"];
  const firstRow = await rows.nth(0);
  for (var i = 0; i < 6; i++) {
    const text = await firstRow.locator("td").nth(i).innerText();
    await expect(text).toBe(firstRowData[i]);
  }

  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByRole("button", { name: "Mode: brief" })).toBeVisible();
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparitysearch Black"
  );
});

test("check load_file and view with csv of unequal row lengths", async ({
  page,
}) => {
  await page.getByLabel("Command input").fill("load_file unequalRows");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText(
    "load_file unequalRows"
  );
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file unequalRowsOutput: Successfully loaded unequalRows"
  );

  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  const table = await page.getByLabel("result table 1");
  await expect(table).toBeVisible();

  const rows = await table.locator("tr");
  const rowsCount = await rows.count();
  await expect(rowsCount).toBe(3);

  const firstRowData = ["1", "2", "3", "4"];
  const secondRowData = ["5", "7"];
  const thirdRowData = ["8", "9", "10"];
  const firstRow = await rows.nth(0);
  const secondRow = await rows.nth(1);
  const thirdRow = await rows.nth(2);
  for (var i = 0; i < firstRowData.length; i++) {
    const text = await firstRow.locator("td").nth(i).innerText();
    await expect(text).toBe(firstRowData[i]);
  }
  for (var i = 0; i < secondRowData.length; i++) {
    const text = await secondRow.locator("td").nth(i).innerText();
    await expect(text).toBe(secondRowData[i]);
  }
  for (var i = 0; i < thirdRowData.length; i++) {
    const text = await thirdRow.locator("td").nth(i).innerText();
    await expect(text).toBe(thirdRowData[i]);
  }
});

test("check load_file and view with empty csv", async ({ page }) => {
  await page.getByLabel("Command input").fill("load_file empty");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText("load_file empty");
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file emptyOutput: CSV file given is empty"
  );

  // View should fail now
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file emptyOutput: CSV file given is emptyCommand: viewOutput: Csv not loaded"
  );
});

test("check load_file and view with csv of 1 column", async ({ page }) => {
  await page.getByLabel("Command input").fill("load_file oneColumn");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText("load_file oneColumn");
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file oneColumnOutput: Successfully loaded oneColumn"
  );

  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  const table = await page.getByLabel("result table 1");
  await expect(table).toBeVisible();

  const rows = await table.locator("tr");
  const rowsCount = await rows.count();
  await expect(rowsCount).toBe(3);

  const firstRowData = "Test";
  const secondRowData = "Test1";
  const thirdRowData = "Test2";
  const firstRow = await rows.nth(0);
  await expect(firstRow).not.toBeNull();
  const secondRow = await rows.nth(1);
  const thirdRow = await rows.nth(2);
  await expect(
    (await firstRow.locator("td").nth(0).innerText()).toString()
  ).toBe(firstRowData);
  await expect(
    (await secondRow.locator("td").nth(0).innerText()).toString()
  ).toBe(secondRowData);
  await expect(
    (await thirdRow.locator("td").nth(0).innerText()).toString()
  ).toBe(thirdRowData);
});

test("load_file, view and search twice to check interweaving", async ({
  page,
}) => {
  await page
    .getByLabel("Command input")
    .fill("load_file dol_ri_earnings_disparity");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");
  await expect(page.getByLabel("history")).toContainText(
    "load_file dol_ri_earnings_disparity"
  );
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Mode: brief" }).click();
  await expect(page.getByLabel("history")).toContainText(
    "Command: load_file dol_ri_earnings_disparityOutput: Successfully loaded dol_ri_earnings_disparity"
  );

  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");

  const table = await page.getByLabel("result table 1");
  await expect(table).toBeVisible();

  const rows = await table.locator("tr");
  const rowsCount = await rows.count();
  await expect(rowsCount).toBe(7);

  const headersData = [
    "State",
    "Data Type",
    "Average Weekly Earnings",
    "Number of Workers",
    "Earnings Disparity",
    "Employed Percent",
  ];
  const firstRowData = [
    "RI",
    "White",
    "$1,058.47",
    "395773.6521",
    "$1.00",
    "75%",
  ];
  const headers = await rows.nth(0);
  const firstRow = await rows.nth(1);
  for (var i = 0; i < 6; i++) {
    const text = await headers.locator("td").nth(i).innerText();
    await expect(text).toBe(headersData[i]);
  }
  for (var i = 0; i < 6; i++) {
    const text = await firstRow.locator("td").nth(i).innerText();
    await expect(text).toBe(firstRowData[i]);
  }

  await page.getByLabel("Command input").fill("search Black");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");

  const search_table = await page.getByLabel("result table 2");
  await expect(table).toBeVisible();

  const search_rows = await search_table.locator("tr");
  const searchRowsCount = await search_rows.count();
  await expect(searchRowsCount).toBe(1);
  const firstSearchRowData = [
    "RI",
    "Black",
    "$770.26",
    "30424.80376",
    "$0.73",
    "6%",
  ];
  const firstSearchRow = await search_rows.nth(0);
  for (var i = 0; i < 6; i++) {
    const text = await firstSearchRow.locator("td").nth(i).innerText();
    await expect(text).toBe(firstSearchRowData[i]);
  }

  await page.getByLabel("Command input").fill("load_file numbers");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");

  await page.getByLabel("Command input").fill("search 1 ID1");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");

  const secondSearchTable = await page.getByLabel("result table 4");
  await expect(secondSearchTable).toBeVisible();
  const secondSearchRow = await secondSearchTable.locator("tr");
  const secondSearchRowCount = await secondSearchRow.count();
  await expect(secondSearchRowCount).toBe(1);

  const secondSearchRowData = ["1", "2", "3"];
  const secondSearchDesiredRow = secondSearchRow.nth(0);
  for (var i = 0; i < 3; i++) {
    const text = await secondSearchDesiredRow.locator("td").nth(i).innerText();
    await expect(text).toBe(secondSearchRowData[i]);
  }

  await page.getByLabel("Command input").fill("load_file unequalRows");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");

  await page.getByLabel("Command input").fill("search 1");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");

  const thirdSearchTable = await page.getByLabel("result table 6");
  await expect(thirdSearchTable).toBeVisible();
  const thirdSearchRow = await thirdSearchTable.locator("tr");
  const thirdSearchRowCount = await thirdSearchRow.count();
  await expect(thirdSearchRowCount).toBe(1);

  const thirdSearchRowData = ["1", "2", "3", "4"];
  const thidSearchDesiredRow = thirdSearchRow.nth(0);
  for (var i = 0; i < 4; i++) {
    const text = await thidSearchDesiredRow.locator("td").nth(i).innerText();
    await expect(text).toBe(thirdSearchRowData[i]);
  }

  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Mode: verbose" }).click();
  await expect(page.getByLabel("Command input")).toHaveValue("");

  const numbersTable = await page.getByLabel("result table 7");
  await expect(numbersTable).toBeVisible();

  const numberRow = await numbersTable.locator("tr");
  const secondRowsCount = await numberRow.count();
  await expect(secondRowsCount).toBe(3);

  const numbersFirstRowData = ["1", "2", "3", "4"];
  const numbersSecondRowData = ["5", "7"];
  const thirdSecondRowData = ["8", "9", "10"];
  const numbersFirstRow = await numberRow.nth(0);
  const numbersSecondRow = await numberRow.nth(1);
  const numbersThirdRow = await numberRow.nth(2);
  for (var i = 0; i < 4; i++) {
    const text = await numbersFirstRow.locator("td").nth(i).innerText();
    await expect(text).toBe(numbersFirstRowData[i]);
  }
  for (var i = 0; i < 2; i++) {
    const text = await numbersSecondRow.locator("td").nth(i).innerText();
    await expect(text).toBe(numbersSecondRowData[i]);
  }
  for (var i = 0; i < 3; i++) {
    const text = await numbersThirdRow.locator("td").nth(i).innerText();
    await expect(text).toBe(thirdSecondRowData[i]);
  }
});
