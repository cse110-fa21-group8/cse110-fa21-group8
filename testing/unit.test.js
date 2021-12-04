// unit.test.js
require("jest-fetch-mock").enableMocks();
fetchMock.dontMock();

import {
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipe,
  authenticate,
  getOneRecipe,
  getOneRecipeExplore,
  addFavorite,
} from "../source/assets/scripts/CRUD.js";
const functions = require("../source/assets/scripts/CRUD.js");

// TODO - Part 2

test("authenticate-login-failed (non-existed user)", async () => {
  let res = await authenticate(
    "non-existed-autoTestingBot",
    "anyPassword",
    "login"
  ).then((resolve) => {
    return resolve;
  });
  expect(res).toBe("incorrect password or username");
});

test("authenticate-login-failed (wrong password)", async () => {
  let res = await authenticate("autoTestingBot", "wrongPassword", "login").then(
    (resolve) => {
      return resolve;
    }
  );
  expect(res).toBe("incorrect password or username");
});

test("authenticate-login-succeeed", async () => {
  let res = await authenticate("autoTestingBot", "abcdefgh", "login").then(
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
    let res = await authenticate('autoTestingBot', '1234', 'register')
                    .then(resolve => {return resolve});
    expect(res).toBe('user already exists');
});
*/
test("authenticate-register-failed", async () => {
  //register same credentials should fail
  let res = await authenticate("autoTestingBot", "1234", "register").then(
    (resolve) => {
      return resolve;
    }
  );
  expect(res).toBe("user already exists");
});

test("getRecipe-succeed", async () => {
  let result = await getRecipe("autoTestingBot").then((resolved) => {
    return resolved;
  });
  expect(Array.isArray(result)).toBe(true);
});

/*
test('the data is the message from server', () => {
    //should fail becaause user not in db
    return functions.addRecipeaddRecipe('title','https://upload.wikimedia.org/wikipedia/commons/9/99/Black_square.jpg','servings', 'cookTime', 'author', 'ingredients', 'instructions', 'tags').then(data => {
        expect(data).toBe('add successful');
    });
});
test('the data is the message from server', () => {
    //should fail becaause user not in db
    return functions.addRecipeaddRecipe('title','https://upload.wikimedia.org/wikipedia/commons/9/99/Black_square.jpg','servings', 'cookTime', 'author', 'ingredients', 'instructions', 'tags').then(data => {
        expect(data).toBe('add successful');
    });
    return functions.addRecipeaddRecipe('title','https://upload.wikimedia.org/wikipedia/commons/9/99/Black_square.jpg','servings', 'cookTime', 'author', 'ingredients', 'instructions', 'tags').then(data => {
        expect(data).toBe('recipe already exists');
    });
});
test('the data is the message from server', () => {
    //should fail becaause user not in db
    return functions.addRecipeaddRecipe('title','https://upload.wikimedia.org/wikipedia/commons/9/99/Black_square.jpg','servings', 'cookTime', 'author', 'ingredients', 'instructions', 'tags').then(data => {
        expect(data).toBe('add successful');
    });
    return functions.deleteRecipe('title').then(data => {
        expect(data).toBe('recipe ${title} deleted');
    });
});

test('the data is the message from server', () => {
    //should fail becaause user not in db
    return functions.addRecipeaddRecipe('title','https://upload.wikimedia.org/wikipedia/commons/9/99/Black_square.jpg','servings', 'cookTime', 'author', 'ingredients', 'instructions', 'tags').then(data => {
        expect(data).toBe('add successful');
    });
    return functions.deleteRecipe('nottitle').then(data => {
        expect(data).toBe("recipe ${title} doesn't exist, cannot delete");
    });
});


test('the data is the message from server', () => {
    //should fail becaause user not in db
    return functions.addRecipeaddRecipe('title','https://upload.wikimedia.org/wikipedia/commons/9/99/Black_square.jpg','servings', 'cookTime', 'author', 'ingredients', 'instructions', 'tags').then(data => {
        expect(data).toBe('add successful');
    });
    return functions.addRecipeaddRecipe('titles','https://upload.wikimedia.org/wikipedia/commons/9/99/Black_square.jpg','servings', 'cookTime', 'author', 'ingredients', 'instructions', 'tags').then(data => {
        expect(data).toBe('recipe already exists');
    });
});
test('the data is the message from server', () => {
    //should fail becaause user not in db
    return functions.addRecipeaddRecipe('title','https://upload.wikimedia.org/wikipedia/commons/9/99/Black_square.jpg','servings', 'cookTime', 'author', 'ingredients', 'instructions', 'tags').then(data => {
        expect(data).toBe('add successful');
    });
    return functions.updateRecipe('title','https://upload.wikimedia.org/wikipedia/commons/9/99/Black_square.jpg','servings', 'cookTime', 'authors', 'ingredients', 'instructions', 'tags').then(data => {
        expect(data).toBe('recipe ${title} updated');
    }); 
});
*/
