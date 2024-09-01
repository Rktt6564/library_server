const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  bookName: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  fine: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    // required: true,
  },
  
  name: {
    type: String,
    required: true,
  },
  roll: {
    type: String,
    required: true,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;


// const mongoose = require('mongoose');

// // Define the Transaction schema
// const transactionSchema = new mongoose.Schema({
//   bookName: String,
//   mobileNo: String,
//   transactionId: String,
//   fine: String,
//   date: Date,
//   userId: String,
//   name: String,
//   roll: String,
// });

// // Create the Transaction model
// const Transaction = mongoose.model('Transaction', transactionSchema);

// module.exports = Transaction;