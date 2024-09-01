// bookModel.js

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  copiesAvailable: {
    type: Number,
    default: 0,
  },
  bookId: {
    type: String,
    required: true,
    unique: true,
  },
  // Add other necessary fields related to the book
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;