import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL, SERVER_URL } from "../../../src/Service/helper";

const Student = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const studentId = searchParams.get("student._id");
  const [student, setStudent] = useState(null);
//   const [marks, setMarks] = useState([]);

  useEffect(() => {
    if (studentId) {
      axios
        .get(`${BASE_URL}/getAdmittedStudentByUserId?studentid=${studentId}`)
        .then((res) => {
          setStudent(res.data);
        })
        .catch((err) => {
          console.error("Error fetching student: ", err);
        });

    //   axios
    //     .get(`${BASE_URL}/getMarksByUserId?studentid=${studentId}`)
    //     .then((res1) => {
    //       setMarks(res1.data);
    //     })
    //     .catch((err) => {
    //       console.error("Error fetching marks: ", err);
    //     });
    }
  }, [studentId]);

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold">Admitted Student Profile</h2>
        <div className="flex justify-center items-center h-full">
          <div className="w-full max-w-screen-lg">
            {student ? (
              <div className="flex flex-col md:flex-row md:space-x-8 justify-center items-center">
                <div className="flex-shrink-0">
                  <img
                    src={`${SERVER_URL}/images/${student.photo}`}
                    className="mentor-photo h-40 w-40 rounded-full"
                    alt="Student"
                  />
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-xl font-bold">{student.name}</h3>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    <span className="text-blue-600">{student.location}</span>
                  </p>
                 
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    <span className="text-blue-600">{student.phone}</span>
                  </p>
                  <p>
                    <span className="font-semibold">School:</span>{" "}
                    <span className="text-blue-600">{student.school}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Class:</span>{" "}
                    <span className="text-blue-600">{student.className}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    <span className="text-blue-600">{student.address}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Discription:</span>{" "}
                    <span className="text-blue-600">{student.discription}</span>
                  </p>
                </div>
              </div>
            ) : (
              <p>No student data available.</p>
            )}
          </div>
        </div>
      </div>
      
    </DashboardLayout>
  );
};

export default Student;
