import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Service/helper";
const Attendance = () => {
  const [status, setStatus] = useState("True");
  const [total, setTotal] = useState(0);
  const [present, setPresent] = useState(0);
  // Function to fetch today's attendance based on class ID
  const fetchAttendance = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/attendanceTotal`);
      // Assuming the API returns an array of attendance data
      setTotal(response.data.totalStudents);
      setPresent(response.data.totalPresentStudents);
    } catch {
      setStatus("False");
      //   console.error("Error fetching attendance:", error);
    }
  }, []);

  // Fetch attendance data on component mount or when classId changes
  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // Calculate total students and total present students

  return (
    <div className="lg:w-1/4 md:w-1/2 w-full p-4">
      {status === "True" ? (
        <div className="border rounded-lg h-36 p-4 bg-teal-800 text-white font-medium flex flex-col justify-center items-center">
          <p>Today&apos;s Attendance</p>
          <p>Total Students: {total}</p>
          <p>Total Present Students: {present}</p>
          {/* <p> {percentage}%</p> */}
        </div>
      ) : (
        <div className="border h-36 p-4 bg-red-900 text-white font-bold flex flex-col justify-center items-center">
          <p>Attendance not taken in any of the class</p>
        </div>
      )}
    </div>
  );
};

export default Attendance;
