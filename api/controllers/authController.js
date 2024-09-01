const Student = require('../models/studentModel');
const Admin = require('../models/adminModel');
const Book = require('../models/bookModel');
const RequestBook = require('../models/requestBookModel');
const Transaction = require('../models/transactionModel');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

require("dotenv").config();
// Additional imports as required
console.log(process.env.JWT_SECRET);
const authControllers = {

  async userLogin(req, res) {
    try {
      const { name, roll } = req.body;
      const student = await Student.findOne({ name, roll });
  
      if (!student) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Assuming you have a check for the password here
      // Add logic to verify the password if needed
  
      // Generate JWT token with user details
      const token = jwt.sign(
        {
          name: student.name,
          roll: student.roll,
          // Add other necessary user details here
        },

        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expiration time
      );
  
      res.status(200).json({ message: 'User login successful', user: student, token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // async adminLogin(req, res) {
  //   try {
  //     const { username, password } = req.body;
  //     const admin = await Admin.findOne({ username, password });

  //     if (!admin) {
  //       return res.status(401).json({ message: 'Invalid admin credentials' });
  //     }
  //     // Add logic for generating tokens, sessions, or handling admin authentication here

  //     res.status(200).json({ message: 'Admin login successful', admin });
  //   } catch (error) {
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // },

  async  adminLogin(req, res) {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username, password });
  
      if (!admin) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
  
      // Generate JWT token with admin username and password
      const token = jwt.sign(
        {
          username: admin.username,
          password: admin.password,
          // Add other necessary admin details here
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expiration time
      );
  
      res.status(200).json({ message: 'Admin login successful', admin, token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async addBook(req, res) {
    try {
      const { title, author, department, copiesAvailable, bookId } = req.body;
      const newBook = new Book({
        title,
        author,
        department,
        copiesAvailable,
        bookId,
      });
      await newBook.save();
      res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getBooks(req, res) {
    try {
      const books = await Book.find();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },


  
  async updateBook(req, res) {
    try {
      const { id } = req.params;
      res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async deleteBook(req, res) {
    try {
      const { id } = req.params;
      await Book.findByIdAndDelete(id);
      res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  async getAllBooks(req, res) {
    try {
      const books = await Book.find();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

async requestBooks(req, res) {
  try {
    const { selectedBooks, studentRoll, studentName } = req.body;

    // Validate if the selected books exist in the database
    const existingBooks = await Book.find({ _id: { $in: selectedBooks } });
    if (existingBooks.length !== selectedBooks.length) {
      return res.status(400).json({ message: 'One or more selected books do not exist' });
    }

    // Create a request for the selected books
    const newRequest = new RequestBook({
      selectedBooks,
      studentRoll,
      studentName,
    });

    await newRequest.save();
    
    res.status(201).json({ message: 'Books requested successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
},   
// Backend - authControllers.js


async getRequestedBooksByRoll(req, res) {
  try {
    const { roll } = req.params; // Extract the roll number from the request parameters

    // Fetch requested books based on the provided roll number
    const requestedBooks = await RequestBook.find({ studentRoll: roll }).populate('selectedBooks');

    res.status(200).json(requestedBooks);
  } catch (error) {
    console.error('Error fetching requested books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},

async deleteBook(req, res) {
  try {
    const { bookId } = req.params;
    const deletedBook = await RequestBook.findOneAndDelete({ _id: bookId });

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found or already deleted' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Failed to delete the book. Please try again later.' });
  }
},

async  getAllBookRequests(req, res) {
  try {
    const bookRequests = await RequestBook.find().populate('selectedBooks');
    res.status(200).json(bookRequests);
  } catch (error) {
    console.error('Error fetching book requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},


async  acceptBookRequest(req, res) {
  try {
    const { requestId } = req.params;
    const request = await RequestBook.findById(requestId).populate('selectedBooks');

    if (!request || request.status !== 'pending') {
      return res.status(400).json({ message: 'Invalid request or request already processed' });
    }

    const selectedBook = request.selectedBooks[0];
    await Book.findByIdAndUpdate(selectedBook._id, { $inc: { copiesAvailable: -1 } });

    await RequestBook.findByIdAndUpdate(requestId, { status: 'accepted' });

    res.status(200).json({ message: 'Request accepted successfully' });
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},

async  rejectBookRequest(req, res) {
  try {
    const { requestId } = req.params;
    await RequestBook.findByIdAndUpdate(requestId, { status: 'rejected' });
    res.status(200).json({ message: 'Request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},

async  markBookGiven(req, res) {
  try {
    const { requestId } = req.params;
    await RequestBook.findByIdAndUpdate(requestId, { status: 'taken' });
    res.status(200).json({ message: 'Request marked as given successfully' });
  } catch (error) {
    console.error('Error marking book as given:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},


async  markBookReceived(req, res) {
  try {
    const { requestId } = req.params;
    const request = await RequestBook.findById(requestId).populate('selectedBooks');

    if (!request || request.status !== 'taken') {
      return res.status(400).json({ message: 'Invalid request or book not yet received' });
    }

    const selectedBook = request.selectedBooks[0];
    await Book.findByIdAndUpdate(selectedBook._id, { $inc: { copiesAvailable: 1 } });

    await RequestBook.findByIdAndUpdate(requestId, { status: 'returned' });

    res.status(200).json({ message: 'Request marked as received successfully' });
  } catch (error) {
    console.error('Error marking book as received:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},




async createTransaction(req, res) {
  try {
    const { bookName, mobileNo, transactionId, fine, date, userId, name, roll } = req.body;
    console.log(req.body);
    const newTransaction = new Transaction({
      bookName,
      mobileNo,
      transactionId,
      fine,
      date,
      userId, // Include userId in the new transaction
      name,
      roll,
    });

    await newTransaction.save();
    res.status(201).json({ message: 'Transaction saved successfully', transaction: newTransaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
,

async getTransactionsByUserId(req, res) {
  try {
    const { roll } = req.params; // Retrieve user's roll from the route parameter

    // Ensure roll exists before querying the database
    if (!roll) {
      return res.status(400).json({ message: 'User roll is missing in the request' });
    }

    // Fetch transactions based on the provided user's roll
    const transactions = await Transaction.find({ roll });

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},

// Fetch user profile
// Get user profile


// Update user profile

async  getAllTransactions(req, res) {
try {
  const transactions = await Transaction.find({}, 'name roll bookName transactionId fine date');
  res.status(200).json(transactions);
} catch (error) {
  console.error('Error fetching transactions:', error);
  res.status(500).json({ message: 'Internal server error' });
}
},

// Get admin information
async getAdminInfoByName(req, res) {
try {
  const { username } = req.user; // Get the username from the authenticated user

  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.status(404).json({ message: 'Admin not found' });
  }

  const adminInfo = {
    username: admin.username,
    profile: {
      name: admin.name,
      designation: admin.designation,
      phone: admin.phone,
      email: admin.email,
    },
  };

  res.status(200).json(adminInfo);
} catch (error) {
  console.error('Error fetching admin information:', error);
  res.status(500).json({ message: 'Server Error' });
}
},

async updateStudentProfile(req, res) {
  try {
    const { roll } = req.params;
    const { department, semester, admissionNumber, dob, phoneNumber, email, photo } = req.body;

    // Check if a photo is uploaded
    let photoString = '';
    if (photo && photo.data && photo.type) {
      const base64String = Buffer.from(photo.data).toString('base64');
      photoString = `data:${photo.type};base64,${base64String}`;
    }

    // Logic to update student profile by roll number
    const updatedProfile = {
      department,
      semester,
      admissionNumber,
      dob,
      phoneNumber,
      email,
      photo: photoString, // Save the base64 string in the student's profile
    };

    // Update student profile using roll number and updatedProfile data
    const updatedStudent = await Student.findOneAndUpdate(
      { roll }, // Find the student by roll number
      updatedProfile, // Update with the new profile data
      { new: true } // To get the updated document
    );

    res.status(200).json({ message: 'Student profile updated successfully', updatedStudent });
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
,
async fetchStudentProfile(req, res) {
  try {
    const { roll } = req.params;
    const student = await Student.findOne({ roll });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Assuming the photo is stored as a URL in the database or it could be base64 data as well
    const { name, department, semester, dob, email, photo } = student;
    const studentData = {
      name,
      roll, // Retaining the original roll value from req.params
      department,
      semester,
      dob,
      email,
      // ...other details
      photo: photo || null, // Assuming 'photo' holds the URL or base64 data
    };

    res.status(200).json({ message: 'Student profile fetched successfully', student: studentData });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
,

















};



module.exports = authControllers;