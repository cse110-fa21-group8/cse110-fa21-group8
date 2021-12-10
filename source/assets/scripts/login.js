import {authenticate} from "./CRUD.js";
const auth_type = "login";

let userName = document.getElementById("username");
let passWord = document.getElementById("password");
let reg = document.getElementById("submit");
let error = document.getElementById("errorMsg");

reg.addEventListener("click", async function () {
  let res = await authenticate(userName.value, passWord.value, auth_type).then(
    (resolve) => {
      return resolve;
    }
  );
  error.style.display = "block";
  error.innerHTML = res;
  // if successfully registered, direct user to explore page
  if (res == "login successful") {
    window.location.href = "homePage.html" + "#" + userName.value;
  } else {
    console.log("error displayed");
    console.log(res);
  }
});

let backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", function () {
  window.location.href = "/";
});