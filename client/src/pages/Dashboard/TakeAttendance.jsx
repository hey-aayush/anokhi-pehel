import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { classes } from "../../constants/Dashboard";
import { BASE_URL } from "../../../src/Service/helper";
import { useSelector } from "react-redux";
import StudentProfileModal from "../../Modals/studentProfileModal";
const Attendance = () => {
  const navigate = useNavigate();
  const [showStudentList, setShowStudentList] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [credentials, setCredentials] = useState({
    classId: "",
    date: "",
  });
  const [attendanceData, setAttendanceData] = useState({});
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedStudent, setSelectedStudent] = useState(null); // State for selected student
  const onChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    if (name === "classId") {
      setShowStudentList(true);
      fetchStudents(value);
    }
  };

  const openModal = (student) => {
    console.log("Opening modal with student data:", student);
    setSelectedStudent(student); // Set the selected student
    setIsModalOpen(true); // Open the modal
  };

  const fetchStudents = (selectedClass) => {
    axios
      .get(`${BASE_URL}/students?class=${selectedClass}`)
      .then((response) => {
        const activeStudents = response.data.filter(
          (student) => student.active
        );
        setStudents(activeStudents);
        const initialData = {};
        activeStudents.forEach((student) => {
          initialData[student._id] = ""; // Initialize with an empty string or another initial value if needed
        });
        setAttendanceData(initialData); // Set the initial attendance data
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData((prevData) => ({
      ...prevData,
      [studentId]: status,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const attendanceRecords = Object.entries(attendanceData).map(
      ([studentId, status]) => ({
        studentId,
        status,
      })
    );

    const attendanceSubmission = {
      classId: credentials.classId,
      date: new Date().toISOString(),
      mentorId: user._id,
      attendanceRecords,
    };
    console.log(attendanceSubmission);
    axios
      .post(`${BASE_URL}/submitAttendance`, attendanceSubmission)
      .then((response) => {
        console.log(response.data);
        if (response.data === "Attendance submitted successfully") {
          alert("Attendance Saved");
          navigate("/Dashboard");
        } else if (response.data === "Attendance updated successfully") {
          alert("Attendance Updated");
          navigate("/Dashboard");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <DashboardLayout>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="space-y-8">
            <div className="border-b border-gray-900/10 pb-8">
              <h2 className="text-base font-bold leading-7 text-gray-900">
                Add Attendance
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Class
                  </label>
                  <div className="mt-2">
                    <select
                      name="classId"
                      id="classId"
                      value={credentials.classId}
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

              <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-x border-t">
                  <tr>
                    <th className=" border-gray-900 p-2 text-gray-900">
                      Student Name
                    </th>
                    <th className=" border-gray-900 p-2 text-center text-gray-900">
                      Add Attendance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td
                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                        onClick={() => openModal(student)} // Open modal on student name click
                      >
                        {student.name}
                      </td>

                      <td className="px-3 py-1 flex justify-center">
                        <div className="flex gap-2">
                          <p
                            className={
                              attendanceData[student._id] === "present"
                                ? "bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                                : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                            }
                            onClick={() => {
                              if (attendanceData[student._id] !== "present") {
                                handleAttendanceChange(student._id, "present");
                              }
                            }}
                          >
                            Present
                          </p>
                          <p
                            className={
                              attendanceData[student._id] === "absent"
                                ? "bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                                : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                            }
                            onClick={() => {
                              if (attendanceData[student._id] !== "absent") {
                                handleAttendanceChange(student._id, "absent");
                              }
                            }}
                          >
                            Absent
                          </p>
                        </div>
                      </td>
                      {/* <td>
                  <select
                    value={attendanceData[student._id]}
                    onChange={(e) =>
                      handleAttendanceChange(student._id, e.target.value)
                    }
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </td> */}
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
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save Attendance
            </button>
          </div>
        </form>
      </div>
      {isModalOpen && selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} // Close the modal on dismiss
        />
      )}
    </DashboardLayout>
  );
};

export default Attendance;
