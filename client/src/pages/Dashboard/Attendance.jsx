import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import axios from "axios";
import { classes } from "../../constants/Dashboard";
import { BASE_URL } from "../../../src/Service/helper";

const Attendance = () => {
  const [credentials, setCredentials] = useState({
    class: "",
    date: "",
  });

  const [status, setStatus] = useState("True");
  const [students, setStudents] = useState([]);
  const [studentsAttendance, setStudentsAttendance] = useState([]);

  useEffect(() => {
    if (credentials.class) {
      fetchAttendanceData(credentials.class);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials.class]);
  const fetchAttendanceData = async (value) => {
    try {
      const response = await axios.get(`${BASE_URL}/totalAttendance`, {
        params: {
          classId: credentials.class,
          date: credentials.date,
        },
      });
      console.log(response.data);
      if (response.status === 200 && response.data.students.length > 0) {
        const firstStudent = response.data.students[0];
        console.log(firstStudent.attendance);
        console.log(value);
        if (firstStudent.attendance && Array.isArray(firstStudent.attendance)) {
          setStudentsAttendance(firstStudent.attendance);
          fetchStudents(value);
          setStatus("True");
        } else {
          setStatus("False");
          console.error("Attendance data structure invalid");
        }
      } else {
        setStatus("False");
        console.error("No attendance data or invalid response");
      }
    } catch (error) {
      setStatus("False");
      console.error("Error fetching attendance data:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetchAttendanceData();
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    if (name === "class") {
      //   fetchStudents(value);
      fetchAttendanceData(value);
    }
  };

  const fetchStudents = () => {
    axios
      .get(`${BASE_URL}/studentList`)
      .then((response) => {
        // console.log(response.data);
        setStudents(response.data); // Set the students data in state
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
                View Attendance
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2 sm:col-start-1">
                  <label
                    htmlFor="class"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Date
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      name="date"
                      value={credentials.date}
                      onChange={onChange}
                    />
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

          {status === "True" && (
            <div className="overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4">
                Attendance for Class {credentials.class} on {credentials.date}
              </h2>
              <table className="min-w-full bg-gray-100">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsAttendance.map((student) => (
                    <tr key={student.studentId} className="text-center">
                      <td className="py-2 px-4">
                        {students.find((s) => s._id === student.studentId)
                          ?.name || "Unknown"}
                      </td>
                      <td className="py-2 px-4">{student.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
