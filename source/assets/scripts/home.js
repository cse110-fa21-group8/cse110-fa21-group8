import {getRecipe} from "./CRUD.js";
window.addEventListener("DOMContentLoaded", init);
const userName = window.location.hash.replace(/^#/, "");

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

async function init() {
  // Create Recipes (took some code from Lab 5)
  let recipes = [];
  var dataBank;

  async function fetchRecipes(username) {
    let result = await getRecipe(username).then((resolved) => {
      return resolved;
    });
    recipes = result;
    return Promise.resolve(true);
  }

  let fetchSuccessful = await fetchRecipes(userName);

  if (!fetchSuccessful) {
    console.log("Recipe fetch unsuccessful");
    return;
  }

  const recipeGrid = document.querySelector(".recipe-grid");
  const recipeElements = document.querySelectorAll(".recipe");
  const recipeSpans = document.querySelectorAll(".recipeSpan");

  const recipeWH = "170vw";
  var pointer = 0;

  console.log(recipes);

  setTimeout(fillGrid, 800);

  function fillGrid() {
    // Remove current recipes on display
    for (let i = 0; i < recipeElements.length; i++) {
      if (recipeElements[i].children.length > 0) {
        if (recipeElements[i].children[0].tagName == "SPAN") {
          recipeElements[i].removeChild(recipeElements[i].children[0]);
          recipeElements[i].textContent = "";
          recipeElements[i].removeAttribute("href");
          recipeElements[i].style.backgroundImage = "";
        }
      }
    }

    // Add new recipes to display
    let capacity = pointer;

    for (
      let i = capacity % recipeElements.length;
      i < recipeElements.length;
      i++
    ) {
      if (pointer >= recipes.length) break;

      // Create recipe element
      const recipe = document.createElement("span");
      console.log(recipes[pointer].img);
      recipe.setAttribute("class", "recipeSpan");
      recipeElements[i].style.backgroundImage = `url(${recipes[pointer].img})`;

      recipe.textContent = recipes[pointer].title;
      recipeElements[i].setAttribute(
        "href",
        "viewRecipe.html#" + userName + "&" + recipes[pointer]._id
      );
      recipeElements[i].appendChild(recipe);

      // Update pointer
      pointer++;
    }

    pointer = capacity + recipeElements.length;
  }

  const rightButton = document.getElementById("right");
  rightButton.addEventListener("click", (e) => {
    if (pointer < recipes.length) fillGrid();
  });

  const leftButton = document.getElementById("left");
  leftButton.addEventListener("click", (e) => {
    if (pointer > recipeElements.length) {
      pointer -= recipeElements.length * 2;
      fillGrid();
    }
  });

  const createButton = document.getElementById("createButton");
  createButton.addEventListener("click", function () {
    window.location.href = "createRecipe.html" + "#" + userName;
  });

  // Go to explore page.
  const exploreButton = document.querySelector(".b");
  exploreButton.addEventListener("click", () => {
    window.location = "explorePage.html" + "#" + userName;
  });

  // Filter for search
  const searchButton = document.querySelector(".search-button");
  const searchBar = document.querySelector(".search");

  searchBar.addEventListener("change", () => {
    let tags = document.querySelector(".tags");
    tags.style.display =
      searchBar.value == ""
        ? tags.setAttribute("hide", "false")
        : tags.setAttribute("hide", "true");
  });

  searchButton.addEventListener("click", querySearch);
  // window.addEventListener("keydown", querySearch);

  function querySearch() {
    fetchRecipes(userName);

    let recipeLength = recipes.length;
    let newRecipes = [];
    for (let i = 0; i < recipeLength; i++) {
      let name =
        recipes[i].title != undefined
          ? recipes[i].title.toString().toLowerCase()
          : "";
      let tags = recipes[i].tags;

      // Filter by name
      if (name.includes(searchBar.value.toLowerCase()))
        newRecipes.push(recipes[i]);

      // Filter by tag
      tags.forEach((element) => {
        if (
          element.toLowerCase().includes(searchBar.value) &&
          !newRecipes.includes(recipes[i])
        )
          newRecipes.push(recipes[i]);
      });
    }
    recipes = newRecipes;
    pointer = 0;

    fillGrid();
  }

  var tagBoxes = document.querySelectorAll(".tags > p");
  tagBoxes.forEach((element) => {
    element.addEventListener("click", () => {
      fetchRecipes(userName);

      let newRecipes = [];
      let recipeLength = recipes.length;
      let selectedTags = document.querySelectorAll(".tags > .selected");

      // Check for no tag selection
      if (selectedTags.length == 0) {
        pointer = 0;
        fillGrid();
        return;
      }

      // Check every tag box if it's been selected
      for (let i = 0; i < recipeLength; i++) {
        let names = recipes[i].tags;
        console.log(recipes[i].tags);

        // Check every tag on recipe to see if it matches the selected box
        names.forEach((name) => {
          selectedTags.forEach((tag) => {
            if (name.toLowerCase().includes(tag.textContent.toLowerCase())) {
              if (!newRecipes.includes(recipes[i])) newRecipes.push(recipes[i]);
            }
          });
        });
      }

      recipes = newRecipes;
      pointer = 0;
      fillGrid();
    });
  });
}
