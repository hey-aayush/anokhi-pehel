import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL, SERVER_URL } from "../../../src/Service/helper";

const Student = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const studentId = searchParams.get("student._id");

  const [student, setStudent] = useState(null);
  const [pocName, setPocName] = useState(""); // Store POC name
  const [pocContact, setPocContact] = useState("");
  const [eventNames, setEventNames] = useState([]); // Store event names

  useEffect(() => {
    if (studentId) {
      // Fetch student details
      axios
        .get(`${BASE_URL}/getParticipantByUserId?studentid=${studentId}`)
        .then((res) => {
          setStudent(res.data);
          
          // Fetch POC name
          if (res.data.poc) {
            axios
              .get(`${BASE_URL}/getPocById?pocId=${res.data.poc}`)
              .then((pocRes) => {
                setPocName(pocRes.data.nameOfPoc); // Set POC name
                setPocContact(pocRes.data.contact); // Set POC contact
              })
              .catch((err) => console.error("Error fetching POC:", err));
          }

          // Fetch event names
          if (res.data.events && res.data.events.length > 0) {
            Promise.all(
              res.data.events.map((eventId) =>
                axios.get(`${BASE_URL}/getEventByEventId?eventId=${eventId}`)
              )
            )
              .then((responses) => {
                const names = responses.map((res) => res.data.eventName);
                setEventNames(names);
              })
              .catch((err) => console.error("Error fetching events:", err));
          }
        })
        .catch((err) => {
          console.error("Error fetching student:", err);
        });
    }
  }, [studentId]);

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold">Student Profile</h2>
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
                  {/* Student Name */}
                  <h3 className="text-xl font-bold">{student.name}</h3>

                  {/* Phone */}
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    <span className="text-blue-600">{student.phone}</span>
                  </p>

                  {/* Aadhaar */}
                  <p>
                    <span className="font-semibold">Aadhaar:</span>{" "}
                    <span className="text-blue-600">{student.aadhar}</span>
                  </p>

                  {/* School */}
                  <p>
                    <span className="font-semibold">School:</span>{" "}
                    <span className="text-blue-600">{student.school}</span>
                  </p>

                  {/* Class */}
                  <p>
                    <span className="font-semibold">Class:</span>{" "}
                    <span className="text-blue-600">{student.class}</span>
                  </p>

                  {/* Address */}
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    <span className="text-blue-600">{student.address}</span>
                  </p>

                  {/* POC */}
                  <p>
                    <span className="font-semibold">POC:</span>{" "}
                    <span className="text-blue-600">{pocName}</span>
                  </p>
                  <p>
                    <span className="font-semibold">POC Contact:</span>{" "}
                    <span className="text-blue-600">{pocContact}</span>
                  </p>

                  {/* Events */}
                  <div className="mt-4">
                    <h4 className="font-semibold">Events:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {eventNames.length > 0 ? (
                        eventNames.map((eventName, index) => (
                          <div
                            key={index}
                            className="bg-white border rounded-lg shadow p-4 transition duration-300 hover:shadow-lg"
                          >
                            <p className="text-blue-600">{eventName}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-red-500">No events found.</p>
                      )}
                    </div>
                  </div>
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
