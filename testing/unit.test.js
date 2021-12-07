// unit.test.js
require("jest-fetch-mock").enableMocks();
fetchMock.dontMock();

import {
  addRecipe,
  updateRecipe,
  deleteRecipe,
  //getRecipe,
  authenticate,
  //getOneRecipe,
  //getOneRecipeExplore,
  favTag,
} from "../source/assets/scripts/CRUD.js";
const functions = require("../source/assets/scripts/CRUD.js");

//id for addRecipe and updateRecipe
let recipeId = "";

//title for addRecipe
const title = "title";

//title for updateRecipe
const updateTitle = "updateTitle";

test("authenticate-login-failed (non-existed user)", async () => {
  let res = await authenticate(
    "non-existed-unitTestBot",
    "anyPassword",
    "login"
  ).then((resolve) => {
    return resolve;
  });
  expect(res).toBe("incorrect password or username");
});

test("authenticate-login-failed (wrong password)", async () => {
  let res = await authenticate("unitTestBot", "wrongPassword", "login").then(
    (resolve) => {
      return resolve;
    }
  );
  expect(res).toBe("incorrect password or username");
});

test("authenticate-login-succeeed", async () => {
  let res = await authenticate("unitTestBot", "12345678", "login").then(
    (resolve) => {
      return resolve;
    }
  );
  expect(res).toBe("login successful");
});
/*
// -------------------------------
// DO NOT RUN THIS TEST FREQUENTLY
// (idle users will be created)
// -------------------------------
test("authenticate-register-succeeed", async () => {
    //register same credentials should fail 
    let res = await authenticate('unitTestBot', '1234', 'register')
                    .then(resolve => {return resolve});
    expect(res).toBe('user already exists');
});
*/

test("authenticate-register-failed (user already exists)", async () => {
  //register same credentials should fail
  let res = await authenticate("unitTestBot", "12345678", "register").then(
    (resolve) => {
      return resolve;
    }
  );
  expect(res).toBe("user already exists");
});

test("authenticate-register-failed (wrong password format)", async () => {
  //register same credentials should fail
  let res = await authenticate("newUnitTestBot", "1234", "register").then(
    (resolve) => {
      return resolve;
    }
  );
  expect(res).toBe(
    "username shuold only include letters and numbers, username shold contain more than 3 characters, password should contain more than 7 characters"
  );
});

test("authenticate-register-failed (wrong username format)", async () => {
  //register same credentials should fail
  let res = await authenticate(
    "new_Unit_Test_Bot",
    "12345678",
    "register"
  ).then((resolve) => {
    return resolve;
  });
  expect(res).toBe(
    "username shuold only include letters and numbers, username shold contain more than 3 characters, password should contain more than 7 characters"
  );
});

test("add-recipe-succeed", async () => {
  let res = await addRecipe(
    "unitTestBot",
    title,
    "https://upload.wikimedia.org/wikipedia/commons/9/99/Black_square.jpg",
    "4",
    "15",
    "Jim",
    [],
    [],
    []
  ).then((resolve) => {
    return resolve;
  });
  recipeId = res;
  expect(res.length > 0).toBe(true);
});

test("favTag-favorite", async () => {
  let res = await favTag(recipeId, "fav").then((resolved) => {
    return resolved;
  });
  expect(res).toBe("added to favorites");
});

test("favTag-unfavorite", async () => {
  let res = await favTag(recipeId, "unfav").then((resolved) => {
    return resolved;
  });
  expect(res).toBe("deleted from favorites");
});

test("update-recipe-succeed", async () => {
  let res = await updateRecipe(
    recipeId,
    updateTitle,
    "https://upload.wikimedia.org/wikipedia/commons/9/99/Black_square.jpg",
    "4",
    "15",
    "Jim",
    [],
    [],
    []
  ).then((resolve) => {
    return resolve;
  });
  expect(res).toBe("recipe updateTitle updated");
});

test("delete-recipe-succeed", async () => {
  let res = await deleteRecipe("unitTestBot", recipeId, updateTitle).then(
    (resolve) => {
      return resolve;
    }
  );
  expect(res).toBe("recipe " + recipeId + " deleted");
});

/*
//NOTE:DECIDED NOT TO TEST GETONERECIPE
test('getOneRecipe-succeed', async () => {

});

//NOTE:DECIDED NOT TO TEST GETONERECIPEEXPLORE
test('getOneRecipe-explore-succeed', async () => {

});

NOTE:DECIDED NOT TO TEST GETRECIPE 
test("getRecipe-succeed", async () => {

});
*/
