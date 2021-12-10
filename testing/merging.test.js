const websiteTested =
  "https://testing.tianyuezhang1997.site/cse110-fa21-group8/merging/";

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

// will be replaced by the "auto generated recipe id from back-end"
let newRecipeID = "";

// title of new recipe added from explore page
let exploredTitle = "";

// Estimated milliseconds needed for one image being loaded on website
const oneImageLoaded = 3000;

// Estimated milliseconds needed for multiple images being loaded on website
const multipleImagesLoaded = 3000;

describe("Basic user flow for Website", () => {
  // First, visit the website
  beforeAll(async () => {
    await page.goto(websiteTested);
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

  it("click login on landing page - index.html", async () => {
    const buttons = await page.$$("#links > a");
    await buttons[2].click(); // Login button
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("Input username and password on login.html", async () => {
    await page.type("#username", username);
    await page.type("#password", password);
    const button = await page.$("#submit");
    await button.click();
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("Click [Explore] on homePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
    const button = await page.$(".b");
    await button.click();
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("Click the first recipe on explorePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
    const buttons = await page.$$(".recipe");
    await buttons[0].click();
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("add the newly explored recipe to the home library on viewRecipeExplore.html", async () => {
    // wait for image to load
    await page.waitForTimeout(oneImageLoaded);
    // momorize the title so that we can search for it later
    const titleTag = await page.$("#title");
    const innerText = await titleTag.getProperty("innerText");
    exploredTitle = innerText["_remoteObject"].value;
    const favBtn = await page.$("#favBtn");
    await favBtn.click();
    // wait for image to load
    await page.waitForTimeout(oneImageLoaded);
  });

  it("Click the back button on viewRecipeExplore.html", async () => {
    const button = await page.$("#backBtn");
    await button.click();
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("Click [Home] on explorePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
    const button = await page.$(".a");
    await button.click();
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("search for the newly explored recipe on homePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
    await page.type("input.search", exploredTitle);
    const search = await page.$("button.search-button");
    await search.click(search);
  });

  it("check whether the explored recipe is on homePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
    const recipes = await page.$$(".recipe");
    let exploredRecipeIndex = -1;
    for (let i = 0; i < recipes.length; i++) {
      const innerText = await recipes[i].getProperty("innerText");
      const currTitle = innerText["_remoteObject"].value;
      if (currTitle === exploredTitle) {
        exploredRecipeIndex = i;
        break;
      }
    }
    await recipes[exploredRecipeIndex].click();
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("Click the edit button on viewRecipe.html", async () => {
    // wait for image to load
    await page.waitForTimeout(oneImageLoaded);
    const button = await page.$("#editBtn");
    await button.click();
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("delete current recipe on editRecipe.html", async () => {
    // wait for image to load
    await page.waitForTimeout(oneImageLoaded);
    const button = await page.$("#deleteRecipeBtn");
    await button.click();
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("search for the newly explored recipe on homePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
    await page.type("input.search", exploredTitle);
    const search = await page.$("button.search-button");
    await search.click(search);
  });

  it("check whether the newly explored recipe is deleted from homePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
    const recipes = await page.$$(".recipe");
    let exploredRecipeIndex = -1;
    for (let i = 0; i < recipes.length; i++) {
      const innerText = await recipes[i].getProperty("innerText");
      const currTitle = innerText["_remoteObject"].value;
      if (currTitle === exploredTitle) {
        exploredRecipeIndex = i;
        break;
      }
    }
    expect(exploredRecipeIndex).toBe(-1);
  });

  it("Click [createButton] on homePage.html", async () => {
    const button = await page.$("#createButton");
    await button.click();
    await page.waitForNavigation({waitUntil: "networkidle2"});
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
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("Click the back button on viewRecipe.html", async () => {
    // wait for image to load
    await page.waitForTimeout(oneImageLoaded);
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
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("go to the second homePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
    // click right button
    const right = await page.$("#right");
    await right.click(right);
  });

  it("go back to the first homePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
    // click left button
    const left = await page.$("#left");
    await left.click(left);
  });

  it("search for the newly created recipe on homePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
    await page.type("input.search", title);
    const search = await page.$("button.search-button");
    await search.click(search);
  });

  it("check whether the new recipe is on homePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
    // find the index of the new recipe
    let newRecipeIndex = await page.evaluate((newRecipeID) => {
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
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("check all information is correct on viewRecipe.html", async () => {
    // wait for image to load
    await page.waitForTimeout(oneImageLoaded);
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
    await page.waitForTimeout(3500);
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
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("Apeend recipe title with (updated) on editRecipe.html", async () => {
    // wait for image to load
    await page.waitForTimeout(oneImageLoaded);
    await page.focus("#title");
    await page.keyboard.press("End");
    await page.type("#title", " (Updated)");
  });

  it("Click the confirm button on editRecipe.html", async () => {
    const button = await page.$("#confirmBtn");
    await button.click();
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("Click the favorite button on viewRecipe.html", async () => {
    // wait for image to load
    await page.waitForTimeout(oneImageLoaded);
    const favBtn = await page.$("#favBtn");
    await favBtn.click();
  });

  it("Click the back button on viewRecipe.html", async () => {
    const button = await page.$("#backBtn");
    await button.click();
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("select the favorite tag on homePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
    // select the favorite tag
    const favorite = await page.$("#favorite");
    await favorite.click();
  });

  it("check whether the recipe is updated on homePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
    // find the index of the new recipe
    let updatedRecipeIndex = await page.evaluate((newRecipeID) => {
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
    const buttons = await page.$$(".recipe");
    const updatedRecipe = buttons[updatedRecipeIndex];
    // check whether title is updated
    const innerText = await updatedRecipe.getProperty("innerText");
    const updatedRecipeText = innerText["_remoteObject"].value;
    expect(updatedRecipeText).toBe(title + " (Updated)");
    // click on the updated recipe
    await updatedRecipe.click();
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("Click the edit button on viewRecipe.html", async () => {
    // wait for image to load
    await page.waitForTimeout(oneImageLoaded);
    const button = await page.$("#editBtn");
    await button.click();
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("delete current recipe on editRecipe.html", async () => {
    // wait for image to load
    await page.waitForTimeout(oneImageLoaded);
    const button = await page.$("#deleteRecipeBtn");
    await button.click();
    await page.waitForNavigation({waitUntil: "networkidle2"});
  });

  it("select the favorite tag on homePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
    // select the favorite tag
    const favorite = await page.$("#favorite");
    await favorite.click();
  });

  it("check whether the new recipe is deleted from homePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
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

  it("unselect the favorite tag on homePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
    // unselect the favorite tag
    const favorite = await page.$("#favorite");
    await favorite.click();
  });

  it("search for the newly created recipe on homePage.html", async () => {
    await page.type("input.search", title);
    const search = await page.$("button.search-button");
    await search.click(search);
  });

  it("check whether the new recipe is deleted from homePage.html", async () => {
    // wait for images to load
    await page.waitForTimeout(multipleImagesLoaded);
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
