import {authenticate} from "./CRUD.js";
const auth_type = "register";

let userName = document.getElementById("username");
let passWord = document.getElementById("password");
let passWordChk = document.getElementById("confirmPassword");
let reg = document.getElementById("submit");
let error = document.getElementById("errorMsg");

reg.addEventListener("click", async function () {
  if (passWord.value == passWordChk.value) {
    let res = await authenticate(
      userName.value,
      passWord.value,
      auth_type
    ).then((resolve) => {
      return resolve;
    });
    error.style.display = "block";
    error.innerHTML = res;
    // if successfully registered, direct user to explore page
    if (res == "register successful") {
      window.location.href = "explorePage.html" + "#" + userName.value;
    } else {
      console.log("error displayed");
      console.log(res);
    }
  }
  // if two passwords doesnt match
  else {
    error.style.display = "block";
    error.innerHTML = "Password doesn't match";
  }
});

let backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", function () {
  window.location.href = "/";
});
