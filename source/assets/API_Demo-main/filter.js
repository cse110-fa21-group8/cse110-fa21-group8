export {filter};
let apiLink = "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com";
const apiKey = "126a45f034mshd1de42a24e5a6d2p14ccefjsnd4686ee15764";

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

var tagBoxes = document.querySelectorAll(".sidenav > input");
tagBoxes.forEach((element) => {
  element.addEventListener("click", () => {
    let selectedTags = [];
    tagBoxes.forEach((tagBox) => {
      if (tagBox.checked) selectedTags.push(tagBox.value.toLowerCase());
    });

    filter(selectedTags, 50);
  });
});

async function filter(tagsArray, fetchNum) {
  let queryStr = "";
  for (let i = 0; i < tagsArray.length; i++) {
    queryStr += i == tagsArray.length - 1 ? tagsArray[i] : tagsArray[i] + "%2C";
  }

  let response = await fetch(
    `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?tags=${queryStr}&number=${fetchNum}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": apiLink,
        "x-rapidapi-key": apiKey,
      },
    }
  );
  let data = await response.json();
  return Promise.resolve(data);
}
