import {addRecipe} from "./CRUD.js";

const userName = window.location.hash.replace(/^#/, "");
let confirmBtn = document.getElementById("confirmBtn");
let uploadImg = document.getElementById("uploadImg");

confirmBtn.addEventListener("click", async function () {
  //Getting all elements
  let recipeTitle = document.getElementById("title").textContent;
  let servings = document.getElementById("servings").value;
  let cookTime = document.getElementById("cookTime").value;
  let author = document.getElementById("author").value;
  let img = uploadImg.files[0];

  //returns all divs in ingredients article and instructions article
  let ingredients = document.querySelectorAll("#ingredients > div");
  let instructions = document.querySelectorAll("#instructions > div");
  let tags = document.querySelectorAll(".tags > *");

  let ingredientsArray = [];
  ingredients.forEach((ingredient) => {
    if (ingredient.className == "ingredient") {
      ingredientsArray.push(ingredient.textContent);
    }
  });

  let instructionsArray = [];
  instructions.forEach((instruction) => {
    if (instruction.className == "instruction") {
      instructionsArray.push(instruction.textContent);
    }
  });

  let tagsArray = [];
  tags.forEach((tag) => {
    if (tag.classList.contains("selected")) {
      tagsArray.push(tag.textContent);
    }
  });

  // result = _id;
  console.log(author);
  let result = await addRecipe(
    userName,
    recipeTitle,
    img,
    servings,
    cookTime,
    author,
    ingredientsArray,
    instructionsArray,
    tagsArray
  ).then((resolved) => {
    return resolved;
  });

  console.log(result);

  window.location.href = "viewRecipe.html" + "#" + userName + "&" + result;
});

// toggle tags based off of selection
let tags = document.querySelectorAll(".tags > *");
tags.forEach((tag) => {
  tag.addEventListener("click", function () {
    if (tag.classList.contains("selected")) {
      tag.classList.remove("selected");
    } else {
      tag.classList.add("selected");
    }
  });
});

// return to view recipe page without making edits
let backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", function () {
  window.location = "homePage.html" + window.location.hash;
});

let ingredientBtns = document.getElementById("ingredientBtns");
// add ingredient text field
let addIngredient = document.getElementById("addIngredient");
addIngredient.addEventListener("click", function () {
  let newIngredient = document.createElement("div");
  newIngredient.setAttribute("role", "textbox");
  newIngredient.setAttribute("contenteditable", "true");
  newIngredient.setAttribute("class", "ingredient");
  ingredientBtns.insertAdjacentElement("beforebegin", newIngredient);
});
// remove ingredient text field
let removeIngredient = document.getElementById("removeIngredient");
removeIngredient.addEventListener("click", function () {
  let toDelete = ingredientBtns.previousElementSibling;
  if (toDelete.nodeName == "DIV") {
    toDelete.remove();
  }
});

let instructionBtns = document.getElementById("instructionBtns");
// add ingredient text field
let addInstruction = document.getElementById("addInstruction");
addInstruction.addEventListener("click", function () {
  let newInstruction = document.createElement("div");
  newInstruction.setAttribute("role", "textbox");
  newInstruction.setAttribute("contenteditable", "true");
  newInstruction.setAttribute("class", "instruction");
  instructionBtns.insertAdjacentElement("beforebegin", newInstruction);
});
// remove ingredient text field
let removeInstruction = document.getElementById("removeInstruction");
removeInstruction.addEventListener("click", function () {
  let toDelete = instructionBtns.previousElementSibling;
  if (toDelete.nodeName == "DIV") {
    toDelete.remove();
  }
});
// change recipe image on upload
let recipeImg = document.getElementById("recipeImg");
uploadImg.addEventListener("change", function () {
  let img = uploadImg.files[0];
  if (img) {
    recipeImg.setAttribute("src", URL.createObjectURL(img));
  }
});
