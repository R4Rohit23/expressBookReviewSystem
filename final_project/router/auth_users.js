// This contains the skeletal implementations for the routes which an authorized user can access.
const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require("express-session");
const app = express();

let users = [];

// Session middleware
app.use(
  session({ secret: "fingerprint", resave: true, saveUninitialized: true })
);

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  let validUsers = users.filter(
    (user) => user.username === username && user.password === password
  );

  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
};


// TASK - 7: Logging in
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).send("Error loggin in");
  }

// IF the user is registered user then create a unique JSON web token for him and also store it in session
  if (authenticatedUser(username, password)) {
    const payload = {
      username: username,
      password: password,
    };
    const secretKey = "access";

    // Creating JSON web token
    const accessToken = jwt.sign(payload, secretKey, {
      expiresIn: 60 * 60,
    });

    req.session.authorization = {
      accessToken, username
  }

    return res.status(200).send("User successfully logged in");
  } 
  else {
    return res.status(400).send("You are not registered");
  }
});

// TASK - 8: Add or Modify Book Review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const filteredBook = books[isbn];

  // if book associated with given isbn number is present
  if (filteredBook) {
    let review = req.query.review;
    let user = req.session.authorization['username'];

    if (review) {
      filteredBook['reviews'][user] = review;
      books[isbn] = filteredBook;
    }
    return res.status(200).send(`The review for book with ISBN ${isbn} has been added/modified by user ${user} successfully`)
  }
  else {
    res.status(204).send("Unable to find book");
  }
});

// TASK - 9: Delete the review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];
  const thatBook = books[isbn];

  if (thatBook) {
    delete thatBook['reviews'][username];
    return res.send(`Review deleted successfully by ${username}`);
  } else {
    return res.status(400).send("Invalid ISBN");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
