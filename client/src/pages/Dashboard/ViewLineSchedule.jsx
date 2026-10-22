import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { locations } from "../../constants/Dashboard";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "jspdf-autotable";
import { BASE_URL } from "../../../src/Service/helper";

const Student = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [filterDay, setFilterDay] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [userData, setUserData] = useState({}); // Store user information

  useEffect(() => {
    // Fetch schedule data when the component mounts
    axios
      .get(`${BASE_URL}/getLineSchedule`)
      .then((response) => {
        setScheduleData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    // Fetch user information when the component mounts
    axios
      .get(`${BASE_URL}/mentorList`)
      .then((response) => {
        const userDataObject = {};
        response.data.forEach((user) => {
          userDataObject[user._id] = {
            name: user.name,
            phone: user.phone,
          };
        });
        setUserData(userDataObject);
      })
      .catch((error) => {
        console.error("Error fetching user information: ", error);
      });
  }, []);
  const getUserInfo = (user_id) => {
    const user = userData[user_id];
    return user
      ? { name: user.name, phone: user.phone }
      : { name: "Uknown", phone: "Number" };
  };
  const filteredSchedule = scheduleData.filter((entry) => {
    // Convert filterDay to lowercase for case-insensitive comparison
    const day = filterDay.toLowerCase();
    // Convert entry day to lowercase for case-insensitive comparison
    const entryDay = entry.schedule[0].day.toLowerCase();

    if (filterDay && entryDay.indexOf(day) === -1) {
      return false; // Skip entries that don't have the specified day
    }
    if (filterLocation && entry.location !== filterLocation) {
      return false; // Skip entries that don't have the specified location
    }
    return true; // Include all other entries
  });

  return (
    <DashboardLayout>
      <div className="m-2 md:m-0 mt-0 p-2 md:p-7 bg-white rounded-3xl">
        <h2 className="text-center text-xl font-bold tracking-tight text-slate-900">
          Line Schedule
        </h2>
        <div className="container mt-5">
          <div className="flex flex-col space-y-0 mb-3 md:flex-row md:space-x-3 md:space-y-0">
            <div className="flex-1 flex flex-col">
              <label className="text-lg text-gray-400">Filter by Day:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search Schedule by Dya"
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="text-lg text-gray-400">
                Filter by Location:
              </label>
              <select
                className="form-control"
                name="location"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                aria-describedby="emailHelp"
              >
                <option value="">Select Location</option>
                {locations.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.location}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-500">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Day</th>
                  <th className="px-4 py-2">Pickup Name</th>
                  <th className="px-4 py-2">Pickup Phone</th>
                  <th className="px-4 py-2">Drop Name</th>
                  <th className="px-4 py-2">Drop Phone</th>
                </tr>
              </thead>
              <tbody className=" text-center bg-gray-800 text-white min-w-full divide-y divide-gray-200 border border-gray-300">
                {filteredSchedule.map((entry, index) => (
                  <React.Fragment key={index}>
                    {entry.schedule.map((scheduleItem, itemIndex) => {
                      const pickupInfo = getUserInfo(scheduleItem.pickup);
                      const dropInfo = getUserInfo(scheduleItem.drop);
                      const pickupInfo1 = getUserInfo(scheduleItem.pickup1);
                      const dropInfo1 = getUserInfo(scheduleItem.drop1);
                      return (
                        <tr key={`${index}-${itemIndex}`}>
                          {itemIndex === 0 ? (
                            <td rowSpan={entry.schedule.length}>
                              {entry.location}
                            </td>
                          ) : null}
                          <td className="border px-4 py-2">
                            {scheduleItem.day}
                          </td>

                          <td className="border px-4 py-2">
                            <div>{pickupInfo.name}</div>
                            <div>{pickupInfo1.name}</div>
                          </td>
                          <td className="border px-4 py-2">
                            <div>{pickupInfo.phone}</div>
                            <div>{pickupInfo1.phone}</div>
                          </td>
                          <td className="border px-4 py-2">
                            <div>{dropInfo.name}</div>
                            <div>{dropInfo1.name}</div>
                          </td>
                          <td className="border px-4 py-2">
                            <div>{dropInfo.phone}</div>
                            <div>{dropInfo1.phone}</div>
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
