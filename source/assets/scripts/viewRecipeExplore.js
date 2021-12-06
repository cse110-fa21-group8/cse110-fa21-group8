import {
  getOneRecipe,
  getOneRecipeExplore,
  addRecipe,
  saveRecipe,
  deleteRecipe,
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
let recipeId;
favBtn.addEventListener("click", async function () {
  // if logged in
  if (loggedIn) {
    if (favBtn.getAttribute("src") == "../source/assets/images/add.png") {
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
      recipeId = await addRecipe(
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
      favBtn.setAttribute("src", "../source/assets/images/cancel.png");
      }
    // unsave
    else if (favBtn.getAttribute("src") == "../source/assets/images/cancel.png") {
      console.log("in line 172: " + recipeId);
      let res = await deleteRecipe(userName, recipeId, result.title)
                        .then((resolved) => {
                          return resolved;
                        });
      console.log(res);
      favBtn.setAttribute("src", "../source/assets/images/add.png");
      }
  }
  // if not logged in
  else {
    window.location.href = "register.html";
  }
});

let backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", function () {
  // check if logged in
  if (loggedIn) {
    window.location.href = "explorePage.html" + "#" + userName;
  } else {
    window.location.href = "explorePage.html";
  }
});

// Alarm sound
let alarm = new Audio("../source/assets/audio/alarm-sound.mp3");

// Toggle timer
let exploreTimer = document.getElementById("exploreTimer");
let timerBox = document.getElementById("timerBox");
exploreTimer.addEventListener("click", function () {
  if (timerBox.getAttribute("class") == "hide") {
    timerBox.setAttribute("class", "show");
  } else {
    timerBox.setAttribute("class", "hide");
    if (
      minutesDisplay.textContent == "00" &&
      secondsDisplay.textContent == "00"
    ) {
      startStopBtn.setAttribute("src", "../source/assets/images/play.png");
      timeInput.setAttribute("class", "show");
      timeDisplay.setAttribute("class", "hide");
      minutesInput.value = "";
      secondsInput.value = "";
      alarm.pause();
      alarm.currentTime = 0;
    }
  }
});

// Close timer button
let closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", function () {
  timerBox.setAttribute("class", "hide");
  if (
    minutesDisplay.textContent == "00" &&
    secondsDisplay.textContent == "00"
  ) {
    startStopBtn.setAttribute("src", "../source/assets/images/play.png");
    timeInput.setAttribute("class", "show");
    timeDisplay.setAttribute("class", "hide");
    minutesInput.value = "";
    secondsInput.value = "";
    alarm.pause();
    alarm.currentTime = 0;
  }
});

let timeInput = document.getElementById("timeInput");
let timeDisplay = document.getElementById("timeDisplay");

let minutesInput = document.getElementById("minutesInput");
let minutesDisplay = document.getElementById("minutesDisplay");

let secondsInput = document.getElementById("secondsInput");
let secondsDisplay = document.getElementById("secondsDisplay");

// Timer start & stop button
let startStopBtn = document.getElementById("startStopBtn");
startStopBtn.addEventListener("click", function () {
  if (timeInput.getAttribute("class") == "hide") {
    startStopBtn.setAttribute("src", "../source/assets/images/play.png");
    timeInput.setAttribute("class", "show");
    timeDisplay.setAttribute("class", "hide");
    if (minutesDisplay.textContent == "00") {
      minutesInput.value = "";
    } else {
      minutesInput.value = minutesDisplay.textContent;
    }
    if (
      minutesDisplay.textContent == "00" &&
      secondsDisplay.textContent == "00"
    ) {
      secondsInput.value = "";
    } else {
      secondsInput.value = secondsDisplay.textContent;
    }

    minutesInput.textContent = minutesInput.value;
    secondsInput.textContent = secondsInput.value;
    alarm.pause();
    alarm.currentTime = 0;
  } else {
    startStopBtn.setAttribute("src", "../source/assets/images/pause.png");
    timeInput.setAttribute("class", "hide");
    timeDisplay.setAttribute("class", "show");
    if (minutesInput.value.length == 2) {
      minutesDisplay.textContent = minutesInput.value;
    } else if (minutesInput.value.length == 1) {
      minutesDisplay.textContent = "0" + minutesInput.value;
    } else {
      minutesDisplay.textContent = "00";
    }

    if (secondsInput.value.length == 2) {
      secondsDisplay.textContent = secondsInput.value;
    } else if (secondsInput.value.length == 1) {
      secondsDisplay.textContent = "0" + secondsInput.value;
    } else {
      secondsDisplay.textContent = "00";
    }
  }
});

// Timer countdown
setInterval(function () {
  if (timeInput.getAttribute("class") == "hide") {
    if (
      minutesDisplay.textContent == "00" &&
      secondsDisplay.textContent == "00"
    ) {
      timerBox.setAttribute("class", "show");
      alarm.play();
    } else {
      let minutes = parseInt(minutesDisplay.textContent);
      let seconds = parseInt(secondsDisplay.textContent);
      if (seconds == 0 && minutes > 0) {
        minutes--;
        seconds = 60;
      }
      let minutesText = minutes.toString();
      seconds--;
      let secondsText = seconds.toString();
      if (minutesText.length == 2) {
        minutesDisplay.textContent = minutesText;
      } else if (minutesText.length == 1) {
        minutesDisplay.textContent = "0" + minutesText;
      } else {
        minutesDisplay.textContent = "00";
      }

      if (secondsText.length == 2) {
        secondsDisplay.textContent = secondsText;
      } else if (secondsText.length == 1) {
        secondsDisplay.textContent = "0" + secondsText;
      } else {
        secondsDisplay.textContent = "00";
      }
    }
  }
}, 1000);

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
