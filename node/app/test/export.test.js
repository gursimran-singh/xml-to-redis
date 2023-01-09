describe("export", () => {
  let originalArgv;

  beforeEach(() => {
    jest.resetModules();

    // Each test overwrites process arguments so store the original arguments
    originalArgv = process.argv;
  });

  afterEach(() => {
    jest.resetAllMocks();

    // Set process arguments back to the original value
    process.argv = originalArgv;
  });

  it("should give error if there is no path argument", async () => {
    const consoleSpy = jest.spyOn(console, "log");

    await runCommand("");

    expect(consoleSpy).toBeCalledWith("missing argument p");
  });

  it("should give error if path to file is not provided", async () => {
    const consoleSpy = jest.spyOn(console, "log");

    await runCommand("-p");

    expect(consoleSpy).toBeCalledWith(
      'The "path" argument must be of type string or an instance of Buffer or URL. Received type boolean (true)'
    );
  });

  it("should give error if file does not exists", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    const file = "dummy.xml";
    await runCommand("-p", file);

    expect(consoleSpy).toBeCalledWith(
      `ENOENT: no such file or directory, open '${file}'`
    );
  });

  it("should give success message", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    const file = "config.xml";
    await runCommand("-p", file);

    expect(consoleSpy).toBeCalledWith(`successfully exported file`);
  });

  it("should print verbose information", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    const file = "config.xml";
    await runCommand("-p", file, "-v");

    expect(JSON.stringify(consoleSpy.mock.calls)).toMatch(/subdomains|cookie/);
  });
});

async function runCommand(...args) {
  process.argv = ["node", "export.js", ...args];

  // Require the yargs CLI script
  return require("../export.js");
}
