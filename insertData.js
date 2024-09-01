const connectDB = require("./config/dbConfig"); // Replace with the correct path to your dbConfig.js
const Student = require("./api/models/studentModel"); // Replace with the correct path to your studentModel.js
const Admin = require("./api/models/adminModel");
//const sportsItem = require("./api/models/sportsItem");
const { error } = require("console");
// Call the connectDB function to connect to MongoDB
connectDB();

//--------------------------------------------------------------------
// Create an instance of the Student model
const newStudentone= new Student({
  name: "Vinay", // replace with your desired userId
  roll: "160121737176", // replace with your desired password
});

// Save the instance to the database
newStudentone
  .save()
  .then(() => {
    console.log("Student data inserted successfully");
  })
  .catch((error) => {
    console.error("Error inserting student data:", error);
  })
  .finally(() => {
    // Close the connection after inserting data
    process.exit(0);
  });

// Create an instance of the Student model



// const newAdminone = new Admin({
//   username: "Srikanth", // replace with your desired userId
//   password: "cbit@23", // replace with your desired password
// });
// //---------------------------------------------------------------------------
// // Save the instance to the database
// newAdminone
//   .save()
//   .then(() => {
//     console.log("Admin data inserted successfully");
//   })
//   .catch((error) => {
//     console.error("Error inserting Admin data:", error);
//   })
//   .finally(() => {
//     // Close the connection after inserting data
//     process.exit(0);
//   });

//------------------------------------------------------------------------------------
// // Create an instance of the SportsItem model
// const newSportsItem = new sportsItem({
//   name: "Football", // replace with the name of the sports item
//   availability: 10, // replace with the initial availability count
//   description: "Official size football for outdoor play", // replace with the description
// });

// // Save the instance to the database
// newSportsItem
//   .save()
//   .then(() => {
//     console.log("Sports item data inserted successfully");
//   })
//   .catch((error) => {
//     console.error("Error inserting sports item data:", error);
//   })
//   .finally(() => {
//     // Close the connection after inserting data
//     process.exit(0);
//   });