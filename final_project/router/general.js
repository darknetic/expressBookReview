const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

// User Registration
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 10: Get all books using async/await with Axios/Promises
public_users.get('/', async function (req, res) {
  try {
    const getBooksPromise = new Promise((resolve) => {
      resolve(books);
    });
    const bookList = await getBooksPromise;
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list" });
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  getBookByISBN
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(err.status).json({ message: err.message }));
});

// Task 12: Get book details based on Author using async/await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = new Promise((resolve) => {
      let filteredBooks = [];
      const keys = Object.keys(books);
      keys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          filteredBooks.push(books[key]);
        }
      });
      resolve(filteredBooks);
    });

    const matchingBooks = await getBooksByAuthor;
    if (matchingBooks.length > 0) {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Task 13: Get all books based on Title using async/await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getBooksByTitle = new Promise((resolve) => {
      let filteredBooks = [];
      const keys = Object.keys(books);
      keys.forEach((key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          filteredBooks.push(books[key]);
        }
      });
      resolve(filteredBooks);
    });

    const matchingBooks = await getBooksByTitle;
    if (matchingBooks.length > 0) {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
