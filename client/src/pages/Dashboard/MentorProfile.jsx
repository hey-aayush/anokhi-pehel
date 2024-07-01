import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Button from "../../components/Dashboard/Button";
import { BASE_URL, SERVER_URL } from "../../../src/Service/helper";

const Student = () => {
  const location = useLocation();
  const currentColor = "#15803d";
  const currentColor1 = "#dc2626";

  let navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const { user } = useSelector((state) => state.user);
  const userId = searchParams.get("mentor._id");
  const [mentor, setMentor] = useState(null);
  const [classSchedule, setClassSchedule] = useState([]); // Store class schedule data
  const [lineSchedule, setLineSchedule] = useState([]); // Store line schedule data
  const [lineSchedule1, setLineSchedule1] = useState([]); // Store line schedule data

  const onClick = async () => {
    try {
      if (userId) {
        // Pass userId as a parameter to the navigate function
        await navigate(`/changeRole?userId=${userId}`);
      } else {
        console.log("userId is not available");
      }
    } catch (error) {
      console.error("Error navigating:", error);
    }
  };
  const onClick1 = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/deleteUser/${userId}`);
      if (response.status === 200) {
        // User deleted successfully
        console.log("User deleted successfully");
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const onClick2 = async () => {
    try {
      if (userId) {
        // Pass userId as a parameter to the navigate function
        await navigate(`/editProfile?mentor._id=${userId}`);
      } else {
        console.log("userId is not available");
      }
    } catch (error) {
      console.error("Error navigating:", error);
    }
  };
  useEffect(() => {
    if (userId) {
      axios
        .get(`${BASE_URL}/getMentorByUserId?mentorId=${userId}`)
        .then((res) => {
          setMentor(res.data);
        })
        .catch((err) => {
          console.error("Error fetching student: ", err);
        });

      axios
        .get(`${BASE_URL}/getClassScheduleByMentorId?mentorId=${userId}`)
        .then((res1) => {
          console.log("Fetched class schedule data:", res1.data); // Log fetched data
          setClassSchedule(res1.data);
        })
        .catch((err) => {
          console.error("Error fetching class schedule: ", err);
        });

      axios
        .get(`${BASE_URL}/getLineScheduleByMentorId?mentorId=${userId}`)
        .then((res2) => {
          // console.log("Fetched class schedule data:", res2.data); // Log fetched data
          setLineSchedule(res2.data);
        })
        .catch((err) => {
          console.error("Error fetching class schedule: ", err);
        });

      axios
        .get(`${BASE_URL}/getLineSchedule1ByMentorId?mentorId=${userId}`)
        .then((res3) => {
          // console.log("Fetched class schedule data:", res3.data); // Log fetched data
          setLineSchedule1(res3.data);
        })
        .catch((err) => {
          console.error("Error fetching class schedule: ", err);
        });
    }
  }, [userId]);

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold">Mentor Profile</h2>

        <div className="mentor-profile bg-gray-100 p-4 rounded-lg flex flex-col lg:flex-row gap-4">
          {mentor ? (
            <div className="mentor-card flex items-center">
              <img
                src={`${SERVER_URL}/images/${mentor?.photo}`}
                className="mentor-photo h-40 w-40 rounded-full object-cover"
                alt="Student"
              />

              <div className="mentor-details ml-4">
                <h3 className="text-xl font-bold">{mentor.name}</h3>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  <span className="text-blue-600">{mentor.phone}</span>
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  <span className="text-blue-600">{mentor.email}</span>
                </p>
                <p>
                  <span className="font-semibold">Registration Number:</span>{" "}
                  <span className="text-blue-600">{mentor.regnumber}</span>
                </p>
              </div>
            </div>
          ) : (
            <p>No Mentor data available.</p>
          )}
          <div className=" justify-center items-center">
            {user?.isAdmin === true && (
              <Button
                color="white"
                bgColor={currentColor}
                text="Change Role"
                borderRadius="8px"
                width="5px"
                height="10px"
                custumFunc={onClick}
              />
            )}
          </div>
          <div className=" justify-center items-center">
            {user?.isAdmin === true && (
              <Button
                color="white"
                bgColor={currentColor1}
                text="Remove Mentor"
                borderRadius="8px"
                width="5px"
                height="10px"
                custumFunc={onClick1}
              />
            )}
          </div>
          <div className=" justify-center items-center">
            {user?.isAdmin === true && (
              <Button
                color="white"
                bgColor={currentColor}
                text="Edit Profile"
                borderRadius="8px"
                width="5px"
                height="10px"
                custumFunc={onClick2}
              />
            )}
          </div>
        </div>

        <div className="class-schedule-container ml-6">
          <h2 className="schedule-title text-center font-bold underline underline-offset-8">
            Class Schedule
          </h2>

          {/* Class Schedule */}
          <div className="bg-gray-100 p-4 rounded-lg mt-4 md:mt-0">
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-500">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-2">Class</th>
                    <th className="px-4 py-2">Day</th>
                    <th className="px-4 py-2">Subject</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {classSchedule && classSchedule.length > 0 ? (
                    classSchedule[0].schedule.map((scheduleItem, index) => {
                      if (
                        scheduleItem.mentor === userId ||
                        scheduleItem.mentor1 === userId
                      ) {
                        return (
                          <tr key={index}>
                            <td className="border px-4 py-2">
                              {classSchedule[0].className}
                            </td>
                            <td className="border px-4 py-2">
                              {scheduleItem.day}
                            </td>
                            <td className="border px-4 py-2">
                              {scheduleItem.subject}
                            </td>
                          </tr>
                        );
                      }
                      return null;
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" className="border px-4 py-2">
                        No class schedule found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="m-2 md:m-0 mt-0 p-2 md:p-7 bg-white rounded-3xl">
          <div className="class-schedule-container">
            <h2 className="schedule-title text-center font-bold underline underline-offset-8">
              Line Schedule
            </h2>

            {/* Pickup Schedule */}
            <h3 className="schedule-title text-center font-bold">Pickup</h3>
            <div className="bg-gray-100 p-4 rounded-lg mt-4 md:mt-0">
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-500">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      {/* <th className="px-4 py-2">PickUp</th> */}
                      <th className="px-4 py-2">Location</th>
                      <th className="px-4 py-2">Day</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {lineSchedule && lineSchedule.length > 0 ? (
                      lineSchedule[0].schedule.map((scheduleItem, index) => {
                        if (
                          scheduleItem.pickup === userId ||
                          scheduleItem.pickup1 === userId
                        ) {
                          return (
                            <tr key={index}>
                              {/* <td className="border px-4 py-2">
                              {scheduleItem.pickup}
                            </td> */}
                              <td className="border px-4 py-2">
                                {lineSchedule[0].location}
                              </td>
                              <td className="border px-4 py-2">
                                {scheduleItem.day}
                              </td>
                            </tr>
                          );
                        }
                        return null;
                      })
                    ) : (
                      <tr>
                        <td colSpan="3" className="border px-4 py-2">
                          No Pickup schedule found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Drop Schedule */}
            <h3 className="schedule-title text-center font-bold">Drop</h3>
            <div className="bg-gray-100 p-4 rounded-lg mt-4 md:mt-8">
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-500">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      {/* <th className="px-4 py-2">Drop</th> */}
                      <th className="px-4 py-2">Location</th>
                      <th className="px-4 py-2">Day</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {lineSchedule1 && lineSchedule1.length > 0 ? (
                      lineSchedule1[0].schedule.map((scheduleItem, index) => {
                        if (
                          scheduleItem.drop === userId ||
                          scheduleItem.drop1 === userId
                        ) {
                          return (
                            <tr key={index}>
                              {/* <td className="border px-4 py-2">
                              {scheduleItem.drop}
                            </td> */}
                              <td className="border px-4 py-2">
                                {lineSchedule1[0].location}
                              </td>
                              <td className="border px-4 py-2">
                                {scheduleItem.day}
                              </td>
                            </tr>
                          );
                        }
                        return null;
                      })
                    ) : (
                      <tr>
                        <td colSpan="3" className="border px-4 py-2">
                          No Drop schedule found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Student;
