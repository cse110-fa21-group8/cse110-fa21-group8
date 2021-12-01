describe("Basic user flow for Website", () => {
  // First, visit the website
  beforeAll(async () => {
    await page.goto(
      "https://testing.tianyuezhang1997.site/cse110-fa21-group8/main/"
    );
  });

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

  it("Check whether [createButton] is functioning", async () => {
    const button = await page.$("#createButton");
    await button.click();
    await page.waitForNavigation({ waitUntil: "networkidle2" });
  });

  it("Input title,servings,cookTime,author on createRecipe.html", async () => {
    await page.type("#title", "Ice Cream Sundae");
    await page.type("#servings", "5");
    await page.type("#cookTime", "45");
    await page.type("#author", "Jonny Tran");
  });

  const selectedTags = [
    "Dessert",
    "Healthy",
    "Sugar Free",
    "Vegan",
    "Cheap!",
    "Intermediate",
  ];

  it("Select tags on createRecipe.html", async () => {
    let tagsToSelect = selectedTags;
    const tags = await page.$$(".tags > p");
    const tagNames = [];
    for (let i = 0; i < tags.length; i++) {
      const innerText = await tags[i].getProperty("innerText");
      tagNames[i] = innerText["_remoteObject"].value;
      if (tagNames[i] == tagsToSelect[0]) {
        tagsToSelect.shift();
        await tags[i].click();
      }
    }
  });

  it("Upload image to createRecipe.html", async () => {
    const fileToUpload = "./testing/src/demo.jpg";
    const button = await page.$("#uploadImg");
    await button.uploadFile(fileToUpload);
    //const fileChosen = await page.$("[aria-hidden]");
    //const innerText = await fileChosen.getProperty("innerText");
    //fileName = innerText["_remoteObject"].value;
    //console.log(fileName);
  });

  it("Clear existing text in Ingredient 1 on createRecipe.html", async () => {
    const ingredient1 = await page.$(".ingredient");
    const innerText = await ingredient1.getProperty("innerText");
    const ingredient1Text = innerText["_remoteObject"].value;
    await page.focus(".ingredient");
    await page.keyboard.press("End");
    for (let i = 0; i < ingredient1Text.length; i++) {
      await page.keyboard.press("Backspace");
    }
  });

  it("Add new ingredients on createRecipe.html", async () => {
    const ingredients = [
      "1 pint chocolate ice cream",
      "1 pint vanilla ice cream",
      "whipped cream",
    ];
    const button = await page.$("#addIngredient");
    for (let i = 0; i < ingredients.length - 1; i++) {
      await button.click();
    }
    // Add new box & Type in new text in the new box
    const boxes = await page.$$("#ingredients > div");
    for (let i = 0; i < ingredients.length; i++) {
      await boxes[i].type(ingredients[i]);
    }
  });

  it("Clear existing text in Instruction 1 on createRecipe.html", async () => {
    const instruction1 = await page.$(".instruction");
    const innerText = await instruction1.getProperty("innerText");
    const instruction1Text = innerText["_remoteObject"].value;
    await page.focus(".instruction");
    await page.keyboard.press("End");
    for (let i = 0; i < instruction1Text.length; i++) {
      await page.keyboard.press("Backspace");
    }
  });

  it("Add new instructions on createRecipe.html", async () => {
    const instructions = [
      "Add chocolate ice cream",
      "Add vanilla ice cream",
      "Add whipped cream",
    ];
    const button = await page.$("#addInstruction");
    for (let i = 0; i < instructions.length - 1; i++) {
      await button.click();
    }
    // Add new box & Type in new text in the new box
    const boxes = await page.$$("#instructions > div");
    for (let i = 0; i < instructions.length; i++) {
      await boxes[i].type(instructions[i]);
    }
  });

  it("Click the confirm button on createRecipe.html", async () => {
    const button = await page.$("#confirmBtn");
    await button.click();
    await page.waitForNavigation({ waitUntil: "networkidle2" });
  });
});
