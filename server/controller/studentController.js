const Student = require("../models/Student");

//Function to retrieve the names of students based on the last attendance taken for a particular month, as all the students' names will be there in the last attendance.
const getStudentsFromLastAttendance = async (req, res) => {
  // Extracting the array of students from the request body
  const students = req.body.value;

  try {
    // Getting the last attendance record
    const lastAttendance = students[students.length - 1];

    // Extracting student IDs from the last attendance record
    const studentIds = lastAttendance.attendance.map(
      (student) => student.studentId
    );

    // Finding student details based on their IDs
    const studentsDetails = await Student.find(
      { _id: { $in: studentIds } },
      "name"
    );

    // Mapping student details to include only _id and name
    const studentDetails = studentsDetails.map((student) => ({
      _id: student._id,
      name: student.name,
    }));

    // Sending the student details as JSON response
    res.status(200).json(studentDetails);
  } catch (error) {
    // Handling any errors that occur during the process
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getStudentsFromLastAttendance };