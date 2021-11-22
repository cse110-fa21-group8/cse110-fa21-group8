// toggle favorites button
let favBtn = document.getElementById('favBtn');
favBtn.addEventListener('click', function () {
    if (favBtn.getAttribute('src') == 'assets/images/heartEmpty.png') {
        favBtn.setAttribute('src', 'assets/images/heartFull.png');
    }
    else {
        favBtn.setAttribute('src', 'assets/images/heartEmpty.png');
    }
});

// move to edit recipe page
let editBtn = document.getElementById('editBtn');
editBtn.addEventListener('click', function () {
    window.location = 'editRecipe.html';
});