import {getOneRecipe, favTag} from "./CRUD.js";

// READ part of CRUD
const hash = window.location.hash.replace(/^#/, "").split("&");
let loggedIn = false;
let _id = 0;
let userName = "";
// Check if logged in
if (hash.length == 2) {
  loggedIn = true;
}
// Get id based on login status
if (loggedIn) {
  _id = hash[1];
  userName = hash[0];
} else {
  _id = hash[0];
}
console.log("userID: " + _id);

let result = await getOneRecipe(_id).then((resolved) => {
  return resolved;
});

let recipeTitle = document.getElementById("title");
recipeTitle.innerHTML = result.title;

let servings = document.getElementById("servings");
servings.innerHTML = result.servings;

let cookTime = document.getElementById("cookTime");
cookTime.innerHTML = result.cookTime;

let author = document.getElementById("author");
author.innerHTML = result.author;

let img = document.getElementById("recipeImg");
img.src = result.img;

let ingredientCount = 1;
result.ingredients.forEach((ingredient) => {
  fillIngredient(ingredient, ingredientCount);
  ingredientCount++;
});

let instructionCount = 1;
result.instructions.forEach((instruction) => {
  fillInstruction(instruction, instructionCount);
  instructionCount++;
});

let tags = document.getElementById("tags");
result.tags.forEach((tag) => {
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

// Toggle favorites button
let favBtn = document.getElementById("favBtn");
// check if already favored
if (result.tags.includes("favorite")) {
  favBtn.setAttribute("src", "../source/assets/images/heartFull.png");
} else {
  favBtn.setAttribute("src", "../source/assets/images/heartEmpty.png");
}
favBtn.addEventListener("click", async function () {
  // if not favored
  if (favBtn.getAttribute("src") == "../source/assets/images/heartEmpty.png") {
    let response = await favTag(_id, "fav").then((resolved) => {
      return resolved;
    });
    console.log(response);
    favBtn.setAttribute("src", "../source/assets/images/heartFull.png");
  } else {
    // if favored
    let response = await favTag(_id, "unfav").then((resolved) => {
      return resolved;
    });
    console.log(response);
    favBtn.setAttribute("src", "../source/assets/images/heartEmpty.png");
  }
});

// Move to edit recipe page
let editBtn = document.getElementById("editBtn");
editBtn.addEventListener("click", function () {
  window.location.href = "editRecipe.html" + window.location.hash;
});

let backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", function () {
  window.location.href = "homePage.html" + "#" + userName;
});

// Alarm sound
let alarm = new Audio("../source/assets/audio/alarm-sound.mp3");

// Toggle timer
let timer = document.getElementById("timer");
let timerBox = document.getElementById("timerBox");
timer.addEventListener("click", function () {
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
