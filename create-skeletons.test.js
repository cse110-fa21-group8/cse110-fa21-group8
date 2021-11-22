describe("Basic user flow for Website", () => {
  // First, visit the website
  beforeAll(async () => {
    await page.goto(
      "https://testing.tianyuezhang1997.site/cse110-fa21-group8/create-skeletons/source/home-page"
    );
  });

  it("Initial Home Page - Check if there is any console log error", async () => {});
  // Keep checking whether there is some "ERROR" in the console log
  page.on("console", (message) => {
    const logMsg =
      message.type() + " " + message.location().url + " " + message.text();
    const logType = message.type();
    if (logType === "error") {
      console.log(logMsg);
    }
    expect(message.type()).not.toBe("error");
  });
});
