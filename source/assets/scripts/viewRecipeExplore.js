import {
  getOneRecipe,
  getOneRecipeExplore,
  addRecipe,
  saveRecipe,
} from "./CRUD.js";

const hash = window.location.hash.replace(/^#/, "").split("&");
let loggedIn = false;
let userName;
let _id;
// if loggedin
if (hash.length == 2) {
  loggedIn = true;
  // hash[0]: username
  // hash[1]: recipeid
  userName = hash[0];
  _id = hash[1];
}
//if not
else {
  _id = hash[0];
}

console.log("username: " + userName);

let result = await getOneRecipeExplore(_id).then((resolved) => {
  return resolved;
});

let recipeTitle = document.getElementById("title");
recipeTitle.innerHTML = result.title;

let servings = document.getElementById("servings");
servings.innerHTML = result.servings;

let cookTime = document.getElementById("cookTime");
cookTime.innerHTML = result.readyInMinutes;

let author = document.getElementById("author");
author.innerHTML = result.creditsText;

let img = document.getElementById("recipeImg");
img.src = result.image;

let ingredientCount = 1;
result.extendedIngredients.forEach((ingredient) => {
  fillIngredient(ingredient.original, ingredientCount);
  ingredientCount++;
});

let instructionCount = 1;
let instructs = result.instructions.split(".");
for (let i = 0; i < instructs.length; i++) {
  if (
    instructs[i].length < 2 ||
    instructs[i].includes("Note:") ||
    instructs[i].includes("Instructions")
  )
    continue;
  fillInstruction(instructs[i], instructionCount);
  instructionCount++;
}

let tags = document.getElementById("tags");
let tagArray = [];
result.dishTypes.forEach((tag) => {
  tagArray.push(tag);
});
result.cuisines.forEach((tag) => {
  tagArray.push(tag);
});
result.occasions.forEach((tag) => {
  tagArray.push(tag);
});
result.diets.forEach((tag) => {
  tagArray.push(tag);
});

tagArray.forEach((tag) => {
  let newTag = document.createElement("p");
  newTag.textContent = tag;
  tags.insertAdjacentElement("beforeend", newTag);
});

function fillIngredient(ingredient, ingredientCount) {
  let ingredients = document.getElementById("ingredients");
  let newIngredient = document.createElement("div");
  let name = "ingredient" + ingredientCount;

  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", name);

  let label = document.createElement("label");
  label.setAttribute("for", name);
  label.innerHTML = ingredient;

  newIngredient.appendChild(checkbox);
  newIngredient.appendChild(label);
  ingredients.appendChild(newIngredient);
}

function fillInstruction(instruction, instructionCount) {
  let instructions = document.getElementById("instructions");
  let newInstruction = document.createElement("div");
  let name = "instruction" + instructionCount;

  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", name);

  let label = document.createElement("label");
  label.setAttribute("for", name);
  label.innerHTML = instruction;

  newInstruction.appendChild(checkbox);
  newInstruction.appendChild(label);
  instructions.appendChild(newInstruction);
}

// toggle favorites button
let favBtn = document.getElementById("favBtn");
let clicked = false;
favBtn.addEventListener("click", async function () {
  if (!clicked) {
    // if logged in
    if (loggedIn) {
      // get the ingredients array
      let ingredientsArray = [];
      // the ingredients
      let ingredientSection = document.getElementById("ingredients").children;
      // first is title
      for (let i = 1; i < ingredientSection.length; i++) {
        ingredientsArray.push(ingredientSection[i].children[1].innerHTML);
      }
      // get the instructions array
      let instructionArray = [];
      // the instructions
      let instructionSection = document.getElementById("instructions").children;
      // first is title
      for (let i = 1; i < instructionSection.length; i++) {
        instructionArray.push(instructionSection[i].children[1].innerHTML);
      }
      // get the tags array
      let tagsArray = [];
      // the tags
      let tagSection = document.getElementById("tags").children;
      for (let i = 0; i < tagSection.length; i++) {
        tagsArray.push(tagSection[i].innerHTML);
      }
      // add recipe to the database
      let recipeId = await addRecipe(
        userName,
        result.title,
        result.image,
        result.servings,
        result.readyInMinutes,
        result.creditsText,
        ingredientsArray,
        instructionArray,
        tagsArray
      ).then((resolved) => {
        return resolved;
      });
      console.log("in line 132 in viewRecipeExplore" + recipeId);
      favBtn.setAttribute("src", "../source/assets/images/confirm.png");
      clicked = true;
    }
    // if not logged in
    else {
      window.location.href = "register.html";
    }
  }
});

// // move to edit recipe page
// let editBtn = document.getElementById("editBtn");
// editBtn.addEventListener("click", function () {
//   // window.location = 'editRecipe.html';
//   window.location.href = "editRecipe.html" + "#" + _id;
// });

let backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", function () {
  // check if logged in
  if (loggedIn) {
    window.location.href = "explorePage.html" + "#" + userName;
  } else {
    window.location.href = "explorePage.html";
  }
});

// Add confetti
let instructions = document.querySelectorAll("#instructions > div > input");
// eslint-disable-next-line no-undef
let confetti = new JSConfetti();
instructions.forEach((element) => {
  element.addEventListener("click", () => {
    if (checkTasks(instructions))
      confetti.addConfetti({
        emojis: ["🧊", "🐻", "😈"],
      });
  });
});

// Check if all instructions are completed
function checkTasks(instructions) {
  for (let i = 0; i < instructions.length; i++) {
    if (!instructions[i].checked) return false;
  }

  return true;
}
