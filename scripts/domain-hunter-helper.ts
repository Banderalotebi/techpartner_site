// This script is a helper for the domain hunter script
// It can be used to perform additional tasks or operations

// For example, you can add a function to send an email to the extracted data
function sendEmail(data: ExtractedData) {
  // Your email sending code here
  console.log("Email sent to", data.email);
}

// Or you can add a function to save the extracted data to a database
function saveToDatabase(data: ExtractedData) {
  // Your database saving code here
  console.log("Data saved to database");
}
