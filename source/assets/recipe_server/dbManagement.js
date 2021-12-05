// get the CRUD Mongodb function
// const MongoClient = require('mongodb').MongoClient;
const mongooseServ = require("mongoose");
const MongoUrl =
  "mongodb+srv://software_devils:software_devils@cluster0.uzv91.mongodb.net";
const dbName = "devil_dishes?retryWrites=true&w=majority";
// get file system
const fs = require("fs");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// connect to MongoDB CRUD system
async function connectdb() {
  await mongooseServ.connect(MongoUrl + "/" + dbName).catch((error) => {
    console.log(error);
  });
  console.log("connected to db");
}
connectdb().catch((err) => console.log(err));

// set up express
const express = require("express");
const app = express();
// const port = 3000;
// parst post request body
const bodyParser = require("body-parser");
// allow browser and server to share data
const cors = require("cors");
// get fileuploads
const fileupload = require("express-fileupload");
// allow sharing data
app.use(cors());
// allow url-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));
// allow json-encoded bodies
app.use(bodyParser.json());
// allow file uploades
app.use(fileupload());

// mongoDB Schemas
// userdata
const userSchema = new mongooseServ.Schema({
  username: String,
  password: String,
  favorites: Array,
});
// recipedata
const recipeSchema = new mongooseServ.Schema({
  title: String,
  img: String,
  ingredients: Array,
  servings: String,
  cookTime: String,
  author: String,
  instructions: Array,
  tags: Array,
});
// Convert Schema to model
const user = mongooseServ.model("user", userSchema);
const recipe = mongooseServ.model("recipe", recipeSchema);
+(
  // routers
  // express operations
  app.get("/", (req, res) => {
    res.send(
      "Server is up and running, if you see this in app check fetch request"
    );
  })
);

// login authentication system
// if user DNE, propose to registesr
// if user exists, check password match
// if matches, res = true
app.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  // if login successfull
  let authResult = await userLogin(username, password)
    .then((resolved) => {
      return resolved;
    })
    .catch((rejected) => {
      return rejected;
    });
  console.log(authResult);
  if (authResult == true) {
    res.send("login successful");
  } else {
    res.send("incorrect password or username");
  }
});

// login authentication process
// if user DNE, propose to registesr
// if user exists, check password match
// if matches, res = true
async function userLogin(username, password) {
  let response = await user.find({username: username, password: password});
  console.log(response);
  // if loggin success
  if (response.length > 0) {
    console.log("resolved promise returned");
    return Promise.resolve(true);
  }
  // if loggin unsuccess
  else {
    console.log("incorrect password");
    return Promise.reject(false);
  }

  // old code
  // authentication
  // user.find({username: username, password: password}, function(err, result) {
  //     // if error
  //     if(err) {
  //         console.error(err);
  //     }
  //     // if password matches (the returned doc is not empty)
  //     if (result) {
  //         console.log("password matches");
  //         loginSuccess = true;
  //         console.log("success is set to true");
  //     }
  //     else {
  //         console.log("incorrect password");
  //     }
  // });
}

// register
app.post("/register", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const favorites = [];
  // if user exists
  let exists = await checkUserExist(username)
    .then((resolved) => {
      return resolved;
    })
    .catch((rejected) => {
      return rejected;
    });
  if (exists) {
    res.send("user already exists");
    return;
  }
  // check if username and password meet limitation (username can only contain letters and numbers)
  if (
    username.length < 4 ||
    password.length < 8 ||
    !/^[A-Za-z0-9]+$/.test(username)
  ) {
    res.send(
      "username shuold only include letters and numbers, username shold contain more than 3 characters, password should contain more than 7 characters"
    );
    return;
  }
  // if user DNE, create a new user profile & store in DB
  const newProfile = new user({
    username: username,
    password: password,
    favorites: favorites,
  });
  await newProfile.save();
  res.send("register successful");
});

app.post("/addFavorite", async function (req, res) {
  const username = req.body.username;
  const _id = req.body._id;
  let exists = await checkUserExist(username)
    .then((resolved) => {
      return resolved;
    })
    .catch((rejected) => {
      return rejected;
    });
  // if user exists
  if (exists) {
    // add the recipe id into user's favorite array
    console.log(
      `recipe ID to add to Favorite: ${_id}  ; username: ${username}`
    );
    user.findOneAndUpdate(
      {username: username},
      {$push: {favorites: _id}},
      function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log(success);
        }
      }
    );
    res.send("updated favorite recipe");
  }
  // if user doesn't exist
  else {
    res.send(`user ${username} doesn't exist`);
  }
});

// check if user exists
async function checkUserExist(username) {
  const exists = await user.exists({username: username});
  if (exists) {
    console.log(`user exists, ${exists} returned`);
    return Promise.resolve(exists);
  }
  // if use DNE
  else {
    console.log(`user DNE, ${exists} returned`);
    return Promise.reject(exists);
  }
}

// get recipe from server, will be added with specific users
// TODO
app.post("/getAllRecipe", async function (req, res) {
  const username = req.body.username;
  // get all recipeIDs from an account
  let currUser = await user
    .findOne({username: username})
    .then((userQuery) => {
      return userQuery;
    })
    .catch((error) => {
      return error;
    });
  const userFav = currUser.favorites;
  // array to send all the data
  let recipeArr = [];
  for (let i = 0; i < userFav.length; i++) {
    let tempRecipe = await recipe
      .findById({_id: userFav[i]})
      .then((recipeData) => {
        return recipeData;
      })
      .catch((error) => {
        return error;
      });
    recipeArr.push(tempRecipe);
  }
  console.log("finished loading all recipes from the user");
  // console.log(recipeArr);
  res.send(recipeArr);
});

// get recipe from server, will be added with specific users
// TODO
app.post("/getRecipe", async function (req, res) {
  const _id = req.body._id;
  let oneRecipe = await recipe
    .findById({_id: _id})
    .then((recipeData) => {
      return recipeData;
    })
    .catch((error) => {
      return error;
    });
  // console.log("in getRecipe: " + _id);
  res.send(oneRecipe);
});

// add image
app.post("/saveImg", function (req, res) {
  const flieName = req.files.image.name;
  const img = req.files.image;
  const path = "user_img/" + flieName;
  img.mv(path, (error) => {
    if (error) {
      console.log(error);
      res.send(error);
      return;
    }
    // if no error, send the path
    res.send(path);
    return;
  });
});

// send the image stored
app.post("/getImg", function (req, res) {
  const imgDir = req.body.imgDir;
  res.sendFile(__dirname + "/" + imgDir);
  return;
});

// delete image helper function
function deleteImg(imgDir) {
  // check if img is stored in the server
  if (imgDir.substring(0, 9) != "user_img/") {
    return;
  }
  // if img is on the server
  fs.unlink(__dirname + "/" + imgDir + ".jpg", function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(`deleted ${imgDir}`);
    }
  });
}

// add recipe
app.post("/add", async function (req, res) {
  const title = req.body.title;
  const img = req.body.img;
  const ingredients = req.body.ingredients;
  const servings = req.body.servings;
  const cookTime = req.body.cookTime;
  const author = req.body.author;
  const instructions = req.body.instructions;
  const tags = req.body.tags;
  const _id = req.body._id;
  console.log(author);
  // if recipe exists
  let exists = await checkRecipeExist(_id)
    .then((resolved) => {
      return resolved;
    })
    .catch((rejected) => {
      return rejected;
    });
  if (exists) {
    res.send("recipe already exists");
    return;
  }
  // if recipe DNE, create a new recipe profile & store in DB
  const newProfile = new recipe({
    title: title,
    img: img,
    ingredients: ingredients,
    servings: servings,
    cookTime: cookTime,
    author: author,
    instructions: instructions,
    tags: tags,
  });
  let id = await newProfile
    .save()
    .then((newRecipe) => {
      return newRecipe._id.toString();
    })
    .catch((err) => {
      return err;
    });
  console.log("in dbManagement in line 245" + id);
  res.send(id);
});

// check if recipe exists
async function checkRecipeExist(_id) {
  const exists = await recipe.exists({_id: _id});
  if (exists) {
    console.log(`recipe exists, ${exists} returned`);
    return Promise.resolve(exists);
  }
  // if recipe DNE
  else {
    console.log(`recipe DNE, ${exists} returned`);
    return Promise.reject(exists);
  }
}

// delete recipe
app.post("/delete", async function (req, res) {
  const username = req.body.username;
  const _id = req.body._id;
  const imgDir = req.body.imgDir;
  // if recipe exists
  let exists = await checkRecipeExist(_id)
    .then((resolved) => {
      return resolved;
    })
    .catch((rejected) => {
      return rejected;
    });
  console.log(_id);
  if (!exists) {
    res.send(`recipe ${_id} doesn't exist, cannot delete`);
    return;
  }
  // if recipe exists, delete from DB
  await recipe.deleteOne({_id: _id}).catch((error) => {
    res.send(`delete failed, ${error}`);
    return;
  });
  // if exists in user's fav, delete
  await user
    .findOneAndUpdate(
      {username: username, favorites: _id},
      {$pull: {favorites: _id}}
    )
    .catch((error) => {
      res.send(`delete failed, ${error}`);
      return;
    });
  // delete the image in the recipe
  deleteImg(imgDir);
  res.send(`recipe ${_id} deleted`);
});

// update recipe
app.post("/update", async function (req, res) {
  const title = req.body.title;
  const img = req.body.img;
  const ingredients = req.body.ingredients;
  const servings = req.body.servings;
  const cookTime = req.body.cookTime;
  const author = req.body.author;
  const instructions = req.body.instructions;
  const tags = req.body.tags;
  const _id = req.body._id;
  // if recipe exists
  let exists = await checkRecipeExist(_id)
    .then((resolved) => {
      return resolved;
    })
    .catch((rejected) => {
      return rejected;
    });
  if (!exists) {
    res.send("recipe doesn't exist, cannot update");
    return;
  }
  // handle unchanged imgs
  if (img == "original") {
    await recipe
      .findByIdAndUpdate(_id, {
        title: title,
        ingredients: ingredients,
        servings: servings,
        cookTime: cookTime,
        author: author,
        instructions: instructions,
        tags: tags,
      })
      .catch((error) => {
        res.send(`update failed, ${error}`);
        return;
      });
  } else {
    // if image is also updated, update the img link
    await recipe
      .findByIdAndUpdate(_id, {
        title: title,
        img: img,
        ingredients: ingredients,
        servings: servings,
        cookTime: cookTime,
        author: author,
        instructions: instructions,
        tags: tags,
      })
      .catch((error) => {
        res.send(`update failed, ${error}`);
        return;
      });
  }

  res.send(`recipe ${title} updated`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`serving on port ${port}`);
});

app.post("/favTag", async function (req, res) {
  const _id = req.body._id;
  const favUnfav = req.body.favUnfav;
  // if addfavtag
  if (favUnfav == "fav") {
    await recipe.findByIdAndUpdate(_id, {$push: {tags: "favorite"}});
    res.send("added to favorites");
    return;
  }
  // if remove addfavtag
  if (favUnfav == "unfav") {
    await recipe.findByIdAndUpdate(_id, {$pull: {tags: "favorite"}});
    res.send("deleted from favorites");
    return;
  }
});
