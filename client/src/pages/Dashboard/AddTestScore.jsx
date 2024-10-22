import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { classes, subjects } from "../../constants/Dashboard";
import { BASE_URL } from "../../../src/Service/helper";
import { useSelector } from "react-redux";
const AddStudent = () => {
  const navigate = useNavigate();
  const [showStudentList, setShowStudentList] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [errors, setErrors] = useState({});
  const [credentials, setCredentials] = useState({
    class: "",
    date: "",
    subject: "",
  });
  const [scoreData, setScoreData] = useState({});

  const [students, setStudents] = useState([]);
  const handleScoreChange = (studentId, score) => {
    if (score >= 0 && score <= 100) {
      setScoreData((prevData) => ({
        ...prevData,
        [studentId]: score,
      }));
      // Clear the error message if the input is valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        [studentId]: "",
      }));
    } else {
      // Display an error message for invalid input
      setErrors((prevErrors) => ({
        ...prevErrors,
        [studentId]: "Invalid score. Please enter a value between 0 and 100.",
      }));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      // Handle validation errors
      return;
    }
    // Prepare the attendance data to be sent to the server
    const scoreRecords = Object.entries(scoreData).map(
      ([studentId, score]) => ({
        studentId,
        score,
      })
    );

    // Create an object with all the data to be sent to the server
    const scoreSubmission = {
      classId: credentials.class,
      subject: credentials.subject,
      mentorId: user,
      date: new Date().toISOString(),
      scores: scoreRecords, // Use "scores" as the property name
    };

    // Send the attendance data to the server using Axios
    axios
      .post(`${BASE_URL}/submitScore`, scoreSubmission)

      .then((res) => {
        if (res.data === "Added") {
          console.log(res.data);
          alert("Score submitted successfully");

          navigate("/Dashboard");
          setScoreData({
            subject: "",
            score: "",
          });
        }
        // Handle the response from the server as needed
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    if (name === "class") {
      setShowStudentList(true);
      fetchStudents(value);
    }
  };

  const fetchStudents = (selectedClass) => {
    axios
      .get(`${BASE_URL}/students?class=${selectedClass}`)
      .then((response) => {
        const activeStudents = response.data.filter(
          (student) => student.active
        );
        setStudents(activeStudents); // Set the students data in state
        const initialData = {};
        activeStudents.forEach((student) => {
          initialData[student._id] = 0; // Default value is -1
        });
        setScoreData(initialData);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  };

  return (
    <DashboardLayout>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="space-y-8">
            <div className="border-b border-gray-900/10 pb-8">
              <h2 className="text-base font-bold leading-7 text-gray-900">
                Add Score
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2 sm:col-start-1">
                  <label
                    htmlFor="class"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Subject
                  </label>
                  <div className="mt-2">
                    <select
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      name="subject"
                      placeholder="Subject"
                      value={credentials.subject}
                      onChange={onChange}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Class
                  </label>
                  <div className="mt-2">
                    <select
                      name="class"
                      id="class"
                      value={credentials.class}
                      onChange={onChange}
                      placeholder="Class"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value="">Select a class</option>
                      {classes.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showStudentList && (
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">Students List</h3>
              <p className="text-sm font-medium mb-3">
                ( Note : Add -1 as test score for those student who is absent in
                the test and add score on scale of 0-100)
              </p>
              <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-x border-t">
                  <tr>
                    <th className=" border-gray-300 p-2">Student Name</th>
                    <th className=" border-gray-300 p-2">Add Test Score</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <th
                        scope="row"
                        className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap "
                      >
                        {student.name}
                      </th>

                      <td className="px-3 py-1">
                        <input
                          type="number" /* Additional input fields for test scores */
                          value={scoreData[student._id].toString()} // Assuming scoreData[student._id] is a number
                          onChange={(e) =>
                            handleScoreChange(
                              student._id,
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddStudent;
