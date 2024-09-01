// studentModel.js

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  roll: {
    type: String,
    required: true,
    unique: true,
  },
  // Add other necessary fields related to the student
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;