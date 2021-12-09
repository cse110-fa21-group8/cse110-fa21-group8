import {filter} from "./filter.js";

// let mainLink = "https://api.spoonacular.com/";
let queryLink = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com";
let apiLink = "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com";
// const apiKey = "&apiKey=c6c6e98c49db4067b8ac5b9fce7703cd";
const apiKey = "126a45f034mshd1de42a24e5a6d2p14ccefjsnd4686ee15764";
let resultSection = document.getElementById("result");
let detail = document.getElementById("detail");
let res = [];

let userName = window.location.hash.replace(/^#/, "");
let loggedIn = false;
// if logged in
if (userName != "") {
  loggedIn = true;
}

window.addEventListener("DOMContentLoaded", init);

async function init() {
  // let Servresponse = await filter([], 50);
  await explore(false);

  // let searchSuccess = false;
  let searchBar = document.getElementById("query");
  let searchButton = document.getElementById("search");
  searchBar.addEventListener("change", () => {
    let tags = document.querySelector(".tags");
    tags.style.display =
      searchBar.value == ""
        ? tags.setAttribute("hide", "false")
        : tags.setAttribute("hide", "true");
  });

  searchButton.addEventListener("click", async function () {
    if (searchBar.value == "") await explore(false);
    else await explore(true);
  });

  window.addEventListener("keydown", async function (event) {
    if (event.key == "Enter") {
      if (searchBar.value == "") await explore(false);
      else await explore(true);
    }
  });

  // Explore the different recipes.
  // queryStatus: true if searching, false if
  async function explore(search) {
    if (search) {
      let response = await fetch(
        queryLink +
          "/" +
          "recipes/complexSearch?query=" +
          document.getElementById("query").value,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": apiLink,
            "x-rapidapi-key": apiKey,
          },
        }
      );
      let data = await response.json();
      console.log("in spnr_search line 45");
      // element name of menu items is "menuItems"
      res = data["results"];
      var tagBoxes = document.querySelectorAll(".tags > p");
      tagBoxes.forEach((element) => {
        element.addEventListener("click", () => {
          // console.log(`tag ${element.value} clicked`)

          let newRecipes = [];
          let recipeLength = res.length;
          let selectedTags = document.querySelectorAll(".tags > .selected");

          // Check for no tag selection
          if (selectedTags.length == 0) {
            pointer = 0;
            fillGrid();
            return;
          }

          // Check every tag box if it's been selected
          for (let i = 0; i < recipeLength; i++) {
            let names = res[i].tags;
            console.log(res[i].tags);

            // Check every tag on recipe to see if it matches the selected box
            names.forEach((name) => {
              if (
                selectedTags.textContent
                  .toLowerCase()
                  .includes(name.toLowerCase())
              ) {
                if (!newRecipes.includes(res[i])) newRecipes.push(res[i]);
              }
            });
          }

          res = newRecipes;
          pointer = 0;
          fillGrid();
        });
      });
    } else {
      let filterRes = await filter([], 50).then((filterRes) => {
        return filterRes;
      });
      res = filterRes["recipes"];

      // When clicking tags, please filter
      var tagBoxes = document.querySelectorAll(".tags > p");
      tagBoxes.forEach((element) => {
        element.addEventListener("click", async function () {
          let selectedElements = document.querySelectorAll(".tags > .selected");
          let selectedTags = [];
          console.log(selectedElements);

          selectedElements.forEach((element) => {
            selectedTags.push(element.textContent.toLowerCase());
          });

          let filterRes = await filter(selectedTags, 50).then((filterRes) => {
            return filterRes;
          });
          res = filterRes["recipes"];
          pointer = 0;
          fillGridExplore();
        });
      });
    }

    // Fill up explore grid
    const recipeElements = document.querySelectorAll(".recipe");
    const recipeSpans = document.querySelectorAll(".recipeSpan");
    // const recipeWH = 60;
    var pointer = 0;

    fillGridExplore();

    const rightButton = document.getElementById("right");
    rightButton.addEventListener("click", (e) => {
      if (pointer < res.length) fillGridExplore();
    });

    const leftButton = document.getElementById("left");
    leftButton.addEventListener("click", (e) => {
      if (pointer > recipeElements.length) {
        pointer -= recipeElements.length * 2;
        fillGridExplore();
      }
    });

    // Go back to home page.
    const homeButton = document.querySelector("a");
    homeButton.addEventListener("click", () => {
      if (loggedIn) {
        window.location.href = "homePage.html" + "#" + userName;
      }
      // if did not login
      else {
        window.location.href = "register.html";
      }
    });

    async function fillGridExplore() {
      // Remove current recipes on display
      for (let i = 0; i < recipeElements.length; i++) {
        if (recipeElements[i].children.length > 0) {
          if (recipeElements[i].children[0].tagName == "IMG") {
            recipeElements[i].removeChild(recipeElements[i].children[0]);
            recipeElements[i].removeAttribute("href");
            recipeElements[i].textContent = "";
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
        if (pointer >= res.length) break;

        // Create recipe element
        recipeElements[i].style.backgroundImage = `url(${res[pointer]["image"]})`;
        recipeSpans[i].textContent = res[pointer]["title"];

        // recipe id
        let idNum = res[pointer].id;

        if (loggedIn) {
          recipeElements[i].setAttribute(
            "href",
            "viewRecipeExplore.html#" + userName + "&" + idNum
          );
        } else {
          recipeElements[i].setAttribute(
            "href",
            "viewRecipeExplore.html#" + idNum
          );
        }
        pointer++;
      }

      pointer = capacity + recipeElements.length;
    }
  }
}
