// toggle tags
let tags = document.querySelectorAll(".tags > *");
tags.forEach(tag => {
    tag.addEventListener('click', function () {
        if (tag.classList.contains('selected')) {
            tag.classList.remove('selected');
        } else {
            tag.classList.add('selected');
        }
    });
});

// return to view recipe page without making edits
let backBtn = document.getElementById('backBtn');
backBtn.addEventListener('click', function () {
    window.location = 'viewRecipe.html';
});
// return to view recipe page without making edits
let cancelBtn = document.getElementById('cancelBtn');
cancelBtn.addEventListener('click', function () {
    window.location = 'viewRecipe.html';
});

let ingredientBtns = document.getElementById('ingredientBtns');
// add ingredient text field
let addIngredient = document.getElementById('addIngredient');
addIngredient.addEventListener('click', function () {
    let newIngredient = document.createElement('div');
    newIngredient.setAttribute('role', 'textbox');
    newIngredient.setAttribute('contenteditable', 'true');
    newIngredient.setAttribute('id', 'newInstruction');
    ingredientBtns.insertAdjacentElement("beforebegin", newIngredient);
});
// remove ingredient text field
let removeIngredient = document.getElementById('removeIngredient');
removeIngredient.addEventListener('click', function () {
    let toDelete = ingredientBtns.previousElementSibling;
    if (toDelete.nodeName == "DIV") {
        toDelete.remove();
    }
});

let instructionBtns = document.getElementById('instructionBtns');
// add ingredient text field
let addInstruction = document.getElementById('addInstruction');
addInstruction.addEventListener('click', function () {
    let newInstruction = document.createElement('div');
    newInstruction.setAttribute('role', 'textbox');
    newInstruction.setAttribute('contenteditable', 'true');
    newInstruction.setAttribute('id', 'newInstruction');
    instructionBtns.insertAdjacentElement("beforebegin", newInstruction);
});
// remove ingredient text field
let removeInstruction = document.getElementById('removeInstruction');
removeInstruction.addEventListener('click', function () {
    let toDelete = instructionBtns.previousElementSibling;
    if (toDelete.nodeName == "DIV") {
        toDelete.remove();
    }
});

// change recipe image on upload
let recipeImg = document.getElementById('recipeImg');
let uploadImg = document.getElementById('uploadImg');
uploadImg.addEventListener('change', function () {
    let img = uploadImg.files[0];
    if (img) {
        recipeImg.setAttribute('src', URL.createObjectURL(img));
    }
});