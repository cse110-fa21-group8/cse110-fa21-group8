import {updateRecipe, getOneRecipe, deleteRecipe} from "./CRUD.js";
// READ part of CRUD
// hash[0]: username
// hash[1]: recipeid
const hash = window.location.hash.replace(/^#/, "").split("&");
const userName = hash[0];
const _id = hash[1];
console.log("on line4, editRecipe.js" + _id);

let result = await getOneRecipe(_id).then((resolved) => {
  return resolved;
});

let uploadImg = document.getElementById("uploadImg");
let recipeImg = document.getElementById("recipeImg");
let recipeTitle = document.getElementById("title");
recipeTitle.innerHTML = result.title;

let servings = document.getElementById("servings");
servings.value = result.servings;

let cookTime = document.getElementById("cookTime");
cookTime.value = result.cookTime;

let author = document.getElementById("author");
author.value = result.author;

let img = document.getElementById("recipeImg");
img.src = result.img;

result.ingredients.forEach((ingredient) => {
  fillIngredient(ingredient);
});

result.instructions.forEach((instruction) => {
  fillInstruction(instruction);
});

let tags = document.querySelectorAll(".tags > *");
tags.forEach((tag) => {
  if (result.tags.includes(tag.textContent)) {
    tag.setAttribute("class", "selected");
  }
});

function fillIngredient(ingredient) {
  let ingredientBtns = document.getElementById("ingredientBtns");
  let newIngredient = document.createElement("div");
  newIngredient.setAttribute("role", "textbox");
  newIngredient.setAttribute("contenteditable", "true");
  newIngredient.setAttribute("class", "ingredient");
  newIngredient.textContent = ingredient;
  ingredientBtns.insertAdjacentElement("beforebegin", newIngredient);
}

function fillInstruction(instruction) {
  let instructionBtns = document.getElementById("instructionBtns");
  let newInstruction = document.createElement("div");
  newInstruction.setAttribute("role", "textbox");
  newInstruction.setAttribute("contenteditable", "true");
  newInstruction.setAttribute("class", "instruction");
  newInstruction.textContent = instruction;
  instructionBtns.insertAdjacentElement("beforebegin", newInstruction);
}

// UPDATE part of CRUD
let confirmBtn = document.getElementById("confirmBtn");
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

  let result = await updateRecipe(
    _id,
    recipeTitle,
    img,
    servings,
    cookTime,
    author,
    ingredientsArray,
    instructionsArray,
    tagsArray,
    userName
  ).then((resolved) => {
    return resolved;
  });
  console.log(result);

  console.log("in editRecipe.js: " + _id);
  // keep the url info, go to viewrecipe page
  window.location.href = "viewRecipe.html" + window.location.hash;
});

// DELETE part of CRUD
let deleteBtn = document.getElementById("deleteRecipeBtn");
deleteBtn.addEventListener("click", async function () {
  // let recipeTitle = result.title;
  let deleted = await deleteRecipe(userName, _id, result.title).then(
    (resolved) => {
      return resolved;
    }
  );
  console.log(deleted);

  // TODO: add below back
  window.location.href = "homePage.html" + "#" + userName;
});

// toggle tags
// let tags = document.querySelectorAll('.tags > *');
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
  window.location.href = "viewRecipe.html" + window.location.hash;
});
// return to view recipe page without making edits
let cancelBtn = document.getElementById("cancelBtn");
cancelBtn.addEventListener("click", function () {
  window.location.href = "viewRecipe.html" + window.location.hash;
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
uploadImg.addEventListener("change", function () {
  let img = uploadImg.files[0];
  if (img) {
    recipeImg.setAttribute("src", URL.createObjectURL(img));
  }
});

/*

async function deleteRecipe() {
    const recipes = [];
    var dataBank;

    async function fetchRecipes() {
        return new Promise((resolve, reject) => {
            fetch("../source/assets/json/data.json")
                .then(response => response.json())
                .then(data => {
                    let ind = 0;
                    delete data['Ice Cream Sundae'];
                    console.log(data);
                    resolve(true);
                })
                .catch(error => reject(false));
        });
    }

    let fetchSuccessful = await fetchRecipes();

    if (!fetchSuccessful) {
        console.log('Recipe fetch unsuccessful');
        return;
    };

    window.location = 'explorePage.html';
}

*/

//on click of delete button, remove ice cream image from fetch data in home.js
