//  This contains the skeletal implementations for the routes which a general user can access.

const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios")
const fs = require("fs")

// to check if user already exist in the list or not
const doesExist = (username) => {
  let filteredusers = users.filter((user) => user.username === username);

  if (filteredusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

// TASK - 6: Registering new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // if valid username and password is provided by the user
  if (username && password) {
    // if user is not exist in the database
    if (!doesExist(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } else {
    return res.status(400).json({message: "Unable to register user"});
  }
});

// TASK - 10: Get books asynchronously using Promise
public_users.get("/get-book-async", (req, res) => {
  const getBooks = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify(books, null, 4)));
  });

  getBooks.then(() => console.log("Books posted successfully!"));
});

// TASK - 11: Getting the book details based on ISBN using Promise callbacks
public_users.get("/get-book-async/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  const getBooks = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify(books[isbn], null, 4)));
  });

  getBooks.then(() => console.log("Books posted successfully!"));
});

// TASK - 12: Getting the book details based on author using Promise callbacks
public_users.get("/get-book-async/:author", (req, res) => {
  const authorName = req.params.author;

  const getBooks = new Promise((resolve, reject) => {
    Object.keys(books).forEach(key => {
      if (authorName === books[key].author) {
        resolve(res.send(JSON.stringify(books[key], null, 4)));
      }
  })});

  getBooks.then(() => console.log("Books posted successfully!"));
});

// TASK - 13: Getting book details based on the title
public_users.get("/get-book-async/:title", (req, res) => {
  const bookTitle = req.params.title;

  const getBooks = new Promise((resolve, reject) => {
    Object.keys(books).forEach(key => {
      if (books[key]['title'] === bookTitle) {
        resolve(res.send(JSON.stringify(books[key], null, 4)));
      }
    })});

    getBooks.then(() => console.log("Books posted successfully!"));
});


// TASK - 1: Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// TASK - 2: Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) 
    return res.send(JSON.stringify(books[isbn], null, 4));
  else 
    return res.send("ISBN is invalid");
});

// TASK - 3: Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const authorName = req.params.author;
  
  Object.keys(books).forEach(key => {
    if (authorName === books[key].author) {
      return res.send(JSON.stringify(books[key], null, 4));
    }
  });

  return res.send("Auther Not Found");
});

// TASK - 4: Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const bookTitle = req.params.title;

  Object.keys(books).forEach(key => {
    if (books[key].title === bookTitle) {
      return res.send(JSON.stringify(books[key]));
    }
  });
  return res.send("Title not found");
});

//  TASK - 5: Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn]['reviews']));
  } else {
    return res.send("ISBN is invalid");
  }

});

module.exports.general = public_users;
