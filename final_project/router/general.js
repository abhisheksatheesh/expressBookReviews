const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add the new user
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
 return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // retrieve ISBN from request URL
  const book = books[isbn];     // find book in the books object

  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author; // Get author from request
  const keys = Object.keys(books); // Get all book keys
  let result = [];

  // Iterate through books and match author
  keys.forEach((key) => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      result.push(books[key]);
    }
  });

  // If books found
  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title; // Get title from request
  const keys = Object.keys(books); // Get all book keys
  let result = [];

  // Iterate through books and match title
  keys.forEach((key) => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      result.push(books[key]);
    }
  });

  // If books found
  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Get ISBN from request

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
// ---------------- ASYNC/AWAIT ROUTES FOR TASKS 10–13 ----------------

// Task 10
public_users.get('/async/books', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/');
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });
  // Task 11
public_users.get('/async/isbn/:isbn', async (req, res) => {
    try {
      const { isbn } = req.params;
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(404).json({ message: "Book not found", error: error.message });
    }
  });
  
  // Task 12
  public_users.get('/async/author/:author', async (req, res) => {
    try {
      const { author } = req.params;
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(404).json({ message: "Author not found", error: error.message });
    }
  });
  
  // Task 13
  public_users.get('/async/title/:title', async (req, res) => {
    try {
      const { title } = req.params;
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(404).json({ message: "Title not found", error: error.message });
    }
  });
  

module.exports.general = public_users;
