const recipesDemo = require("./src/recipes.json");

const accountsDemo = require("./src/accounts.json");

// username
const username = accountsDemo.accounts[0].username;

// password
const password = accountsDemo.accounts[0].password;

// title of new recipe
const title = recipesDemo.recipes[1].title;

// servings of new recipe
const servings = recipesDemo.recipes[1].servings;

// cookTime of new recipe
const cookTime = recipesDemo.recipes[1].cookTime;

// author of new recipe
const author = recipesDemo.recipes[1].author;

// tags to be selected (from left to right)
const selectedTags = recipesDemo.recipes[1].selectedTags;

// image location of the new recipe
const image = recipesDemo.recipes[1].image;

// ingredients to be added (from top to bottom)
const ingredients = recipesDemo.recipes[1].ingredients;

// instructions to be added (from top to bottom)
const instructions = recipesDemo.recipes[1].instructions;

// will be replaced by the "auto generated recipe from back-end"
let newRecipeID = "";

// will be updated as searching result
// depends on where the new recipe is located on the home page
let newRecipeIndex = 0;

describe("Basic user flow for Website", () => {
  // First, visit the website
  beforeAll(async () => {
    await page.goto("https://frosty-poincare-dc3f79.netlify.app/");
  });

  // Keep checking whether there is some "ERROR" in the console log
  page.on("console", (message) => {
    const logMsg =
      message.type() + " " + message.location().url + " " + message.text();
    const logType = message.type();
    if (logType === "error") {
      console.log(logMsg);
    }
    //expect(message.type()).not.toBe("error");
  });

  it("click login on landing page", async () => {
    const buttons = await page.$$("#links > a");
    await buttons[2].click(); // Login button
    await page.waitForNavigation({ waitUntil: "networkidle2" });
  });

  it("Input username and password on createRecipe.html", async () => {
    await page.type("#username", username);
    await page.type("#password", password);
    const button = await page.$("#submit");
    await button.click();
    await page.waitForNavigation({ waitUntil: "networkidle2" });
  });

  it("Click [createButton] on home page", async () => {
    const button = await page.$("#createButton");
    await button.click();
    await page.waitForNavigation({ waitUntil: "networkidle2" });
  });

  it("Input title,servings,cookTime,author on createRecipe.html", async () => {
    await page.type("#title", title);
    await page.type("#servings", servings);
    await page.type("#cookTime", cookTime);
    await page.type("#author", author);
  });

  it("Select tags on createRecipe.html", async () => {
    let tagsToSelect = selectedTags;
    const tags = await page.$$(".tags > p");
    for (let i = 0; i < tags.length; i++) {
      const innerText = await tags[i].getProperty("innerText");
      const tagName = innerText["_remoteObject"].value;
      if (tagName == tagsToSelect[0]) {
        tagsToSelect.shift();
        await tags[i].click();
      }
    }
  });

  it("Upload image to createRecipe.html", async () => {
    const fileToUpload = image;
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
    // Add new boxes & Type in new text in each new box
    const button = await page.$("#addIngredient");
    for (let i = 0; i < ingredients.length - 1; i++) {
      await button.click();
    }
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

  it("Click the back button on viewRecipe.html", async () => {
    // get ID : "#......" of the newly created recipe
    const viewRecipeURL = await page.url();
    let subStrBegin = 0;
    for (let i = 0; i < viewRecipeURL.length; i++) {
      if (viewRecipeURL[i] == "#") {
        subStrBegin = i;
      }
    }
    newRecipeID = viewRecipeURL.substring(subStrBegin);
    // click on the back button
    const button = await page.$("#backBtn");
    await button.click();
    await page.waitForNavigation({ waitUntil: "networkidle2" });
  });

  it("go to the second page, then go back to the first page", async () => {
    // click right button
    const right = await page.$("#right");
    await right.click(right);
    // wait for recipes to load
    await page.waitForTimeout(1000);
    // click left button
    const left = await page.$("#left");
    await left.click(left);
    // wait for recipes to load
    await page.waitForTimeout(1000);
  });

  it("search for the newly created recipe", async () => {
    await page.type("input.search", title);
    const search = await page.$("button.search-button");
    await search.click(search);
    // wait for searched recipe to load
    await page.waitForTimeout(1000);
  });

  it("check whether the new recipe is on home page", async () => {
    // wait for images to load
    await page.waitForTimeout(2000);
    // find the index of the new recipe
    newRecipeIndex = await page.evaluate((newRecipeID) => {
      let recipeIndex = -1;
      const recipes = document.querySelectorAll(".recipe");
      for (let i = 0; i < recipes.length; i++) {
        const href = "" + recipes[i].getAttribute("href");
        if (href.includes(newRecipeID)) {
          recipeIndex = i;
          break;
        }
      }
      return recipeIndex;
    }, newRecipeID);
    // click on the newly created recipe
    const buttons = await page.$$(".recipe");
    await buttons[newRecipeIndex].click();
    await page.waitForNavigation({ waitUntil: "networkidle2" });
  });

  it("check all information is correct on viewRecipe.html", async () => {
    let innerText = "";
    // check "title" is the same as expected
    const viewTitle = await page.$("#title");
    innerText = await viewTitle.getProperty("innerText");
    const viewTitleText = innerText["_remoteObject"].value;
    expect(viewTitleText).toBe(title);

    // check "servings" is the same as expected
    const viewServings = await page.$("#servings");
    innerText = await viewServings.getProperty("innerText");
    const viewServingsText = innerText["_remoteObject"].value;
    expect(viewServingsText).toBe(servings);

    // check "cookTime" is the same as expected
    const viewCookTime = await page.$("#cookTime");
    innerText = await viewCookTime.getProperty("innerText");
    const viewCookTimeText = innerText["_remoteObject"].value;
    expect(viewCookTimeText).toBe(cookTime);

    // check "author" is the same as expected
    const viewAuthor = await page.$("#author");
    innerText = await viewAuthor.getProperty("innerText");
    const viewAuthorText = innerText["_remoteObject"].value;
    expect(viewAuthorText).toBe(author);

    // TBD
  });

  it("test timer on viewRecipe.html", async () => {
    // open and set a 3 sec timer
    const timer = await page.$("#timer");
    await timer.click();
    await page.type("#minutesInput", "00");
    await page.type("#secondsInput", "03");
    // start the timer
    const startStopBtn = await page.$("#startStopBtn");
    await startStopBtn.click();
    // wait the timer to beep
    await page.waitForTimeout(2000);
    // stop the timer
    await startStopBtn.click();
    // close the timer
    const closeBtn = await page.$("#closeBtn");
    await closeBtn.click();
  });

  it("check all checkbox on viewRecipe.html", async () => {
    // check all ingredients check box
    const ingredientsCheckBox = await page.$$("#ingredients input");
    for (let i = 0; i < ingredientsCheckBox.length; i++) {
      await ingredientsCheckBox[i].click();
    }
    // check all instructions box
    const instructionsCheckBox = await page.$$("#instructions input");
    for (let i = 0; i < instructionsCheckBox.length; i++) {
      await instructionsCheckBox[i].click();
    }
  });

  it("Click the edit button on viewRecipe.html", async () => {
    const button = await page.$("#editBtn");
    await button.click();
    await page.waitForNavigation({ waitUntil: "networkidle2" });
  });

  it("Check whether editing is functioning on editRecipe.html", async () => {
    await page.focus("#title");
    await page.keyboard.press("End");
    await page.type("#title", " (Updated)");
  });

  it("Click the confirm button on createRecipe.html", async () => {
    const button = await page.$("#confirmBtn");
    await button.click();
    await page.waitForNavigation({ waitUntil: "networkidle2" });
  });

  it("Click the favorite button on viewRecipe.html", async () => {
    const favBtn = await page.$("#favBtn");
    await favBtn.click();
    // wait for the current recipe to be recored as favorited
    await page.waitForTimeout(1000);
  });

  it("Click the back button on viewRecipe.html", async () => {
    const button = await page.$("#backBtn");
    await button.click();
    await page.waitForNavigation({ waitUntil: "networkidle2" });
  });

  it("click on favorite tag", async () => {
    // click favorite button
    const favorite = await page.$("#favorite");
    await favorite.click();
    // wait for favorite recipes to load
    await page.waitForTimeout(1000);
  });

  it("check whether the recipe is updated on home page", async () => {
    const buttons = await page.$$(".recipe");
    const updatedRecipe = buttons[newRecipeIndex];
    // check whether title is updated
    const innerText = await updatedRecipe.getProperty("innerText");
    const updatedRecipeText = innerText["_remoteObject"].value;
    expect(updatedRecipeText).toBe(title + " (Updated)");
    // click on the updated recipe
    await updatedRecipe.click();
    await page.waitForNavigation({ waitUntil: "networkidle2" });
  });

  it("Click the edit button on viewRecipe.html", async () => {
    const button = await page.$("#editBtn");
    await button.click();
    await page.waitForNavigation({ waitUntil: "networkidle2" });
  });

  it("delete current recipe on editRecipe.html", async () => {
    const button = await page.$("#deleteRecipeBtn");
    await button.click();
    await page.waitForNavigation({ waitUntil: "networkidle2" });
  });

  it("click on favorite tag", async () => {
    // click favorite button
    const favorite = await page.$("#favorite");
    await favorite.click();
    // wait for favorite recipes to load
    await page.waitForTimeout(1000);
  });

  it("check whether the new recipe is deleted from home page", async () => {
    // wait for images to load
    await page.waitForTimeout(2000);
    // find the index of the deleted new recipe
    const deletedRecipeIndex = await page.evaluate((newRecipeID) => {
      let recipeIndex = -1;
      const recipes = document.querySelectorAll(".recipe");
      for (let i = 0; i < recipes.length; i++) {
        const href = "" + recipes[i].getAttribute("href");
        if (href.includes(newRecipeID)) {
          recipeIndex = i;
          break;
        }
      }
      return recipeIndex;
    }, newRecipeID);
    expect(deletedRecipeIndex).toBe(-1);
  });

  it("search for the newly created recipe", async () => {
    await page.type("input.search", title);
    const search = await page.$("button.search-button");
    await search.click(search);
    // wait for searched recipe to load
    await page.waitForTimeout(1000);
  });

  it("check whether the new recipe is deleted from home page", async () => {
    // wait for images to load
    await page.waitForTimeout(2000);
    // find the index of the deleted new recipe
    const deletedRecipeIndex = await page.evaluate((newRecipeID) => {
      let recipeIndex = -1;
      const recipes = document.querySelectorAll(".recipe");
      for (let i = 0; i < recipes.length; i++) {
        const href = "" + recipes[i].getAttribute("href");
        if (href.includes(newRecipeID)) {
          recipeIndex = i;
          break;
        }
      }
      return recipeIndex;
    }, newRecipeID);
    expect(deletedRecipeIndex).toBe(-1);
  });
});
