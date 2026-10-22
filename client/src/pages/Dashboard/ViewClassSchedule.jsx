import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { classes } from "../../constants/Dashboard";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "jspdf-autotable";
import { BASE_URL } from "../../../src/Service/helper";

const Student = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [filterDay, setFilterDay] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [mentorsInfo, setMentorsInfo] = useState({}); // Store mentor information

  useEffect(() => {
    // Fetch schedule data when the component mounts
    axios
      .get(`${BASE_URL}/getClassSchedule`)
      .then((response) => {
        setScheduleData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // Fetch mentor information when the component mounts
    axios
      .get(`${BASE_URL}/mentorList`)
      .then((response) => {
        // Convert the response data into a mentor information object
        const mentorData = {};
        response.data.forEach((mentor) => {
          mentorData[mentor._id] = {
            name: mentor.name,
            phone: mentor.phone,
          };
        });
        setMentorsInfo(mentorData);
        // console.log("Mentors Info:", mentorData); // Debugging
      })
      .catch((error) => {
        console.error("Error fetching mentors: ", error);
      });
  }, []);

  // Function to get mentor name and phone based on user_id
  const getMentorInfo = (user_id) => {
    const mentor = mentorsInfo[user_id];
    return mentor
      ? { name: mentor.name, phone: mentor.phone }
      : { name: "", phone: "" };
  };

  const filteredSchedule = scheduleData.filter((entry) => {
    // Convert filterDay to lowercase for case-insensitive comparison
    const day = filterDay.toLowerCase();
    // Convert entry day to lowercase for case-insensitive comparison
    const entryDay = entry.schedule[0].day.toLowerCase();

    if (filterDay && entryDay.indexOf(day) === -1) {
      return false; // Skip entries that don't have the specified day
    }
    if (filterClass && entry.className !== filterClass) {
      return false; // Skip entries that don't have the specified class
    }
    return true; // Include all other entries
  });
  return (
    <DashboardLayout>
      <div className="m-2 md:m-0 mt-0 p-2 md:p-7 bg-white rounded-3xl">
        <h2 className="text-center text-xl font-bold tracking-tight text-slate-900">
          Class Schedule
        </h2>
        <div className="container mt-5">
          <div className="flex flex-col space-y-0 mb-3 md:flex-row md:space-x-3 md:space-y-0">
            <div className="flex-1 flex flex-col">
              <label className="text-lg text-gray-400">Filter by Day:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search Schedule by Day"
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="text-lg text-gray-400">Filter by Class:</label>
              <select
                className="form-control"
                name="class"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                aria-describedby="emailHelp"
              >
                <option value="">Select Class</option>
                {classes.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-500">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-2">Class Name</th>
                  <th className="px-4 py-2">Day</th>
                  <th className="px-4 py-2">Subject</th>
                  <th className="px-4 py-2">Mentor</th>

                  <th className="px-4 py-2">Phone</th>
                </tr>
              </thead>
              <tbody className=" text-center bg-gray-800 text-white min-w-full divide-y divide-gray-200 border border-gray-300">
                {filteredSchedule.map((entry, index) => (
                  <React.Fragment key={index}>
                    {entry.schedule.map((scheduleItem, itemIndex) => {
                      const mentorInfo = getMentorInfo(scheduleItem.mentor);
                      const mentorInfo1 = getMentorInfo(scheduleItem.mentor1);
                      return (
                        <tr key={`${index}-${itemIndex}`}>
                          {itemIndex === 0 ? (
                            <td rowSpan={entry.schedule.length}>
                              {entry.className}
                            </td>
                          ) : null}
                          <td className="border px-4 py-2">
                            {scheduleItem.day}
                          </td>
                          <td className="border px-4 py-2">
                            {scheduleItem.subject}
                          </td>
                          <td className="border px-4 py-2">
                            <div>{mentorInfo.name}</div>
                            <div>{mentorInfo1.name}</div>
                          </td>
                          <td className="border px-4 py-2">
                            <div>{mentorInfo.phone}</div>
                            <div>{mentorInfo1.phone}</div>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Student;
