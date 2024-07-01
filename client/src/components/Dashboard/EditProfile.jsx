import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL, SERVER_URL } from "../../Service/helper";
import { FiEdit } from "react-icons/fi";
import { BRANCH } from "../../constants/Dashboard";
const Student = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("mentor._id");
  const [mentor, setMentor] = useState(null);

  const [classSchedule, setClassSchedule] = useState([]); // Store class schedule data
  const [lineSchedule, setLineSchedule] = useState([]); // Store line schedule data
  const [lineSchedule1, setLineSchedule1] = useState([]); // Store line schedule data
  const [editingField, setEditingField] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const handleEdit = (field, value) => {
    setEditingField(field);
    setEditedValue(value);
  };
  const onPhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("field", editingField);
      formData.append("newValue", editedValue);
      formData.append("userId", userId);
      formData.append("photo", photoFile); // Append the photo file to the form data
      //   console.log(photoFile);
      // Make API call to update mentor data
      const response = await axios.patch(
        `${BASE_URL}/update-mentor`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to update mentor data");
      }
      setEditingField(null); // Reset editingField state
      alert("Your data has been successfully updated.");
      window.location.reload();
    } catch (error) {
      console.error("Error updating mentor data:", error);
      // Handle error (e.g., display an error message to the user)
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
          // console.log("Fetched class schedule data:", res1.data); // Log fetched data
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
        <h2 className="text-2xl font-bold text-center my-4">Your Profile</h2>

        <div className="mentor-profile bg-gray-100 p-4 rounded-lg">
          {mentor ? (
            <div className="mentor-card flex items-center">
              <div className="relative">
                {editingField === "photo" ? (
                  <div>
                    <input
                      type="file"
                      id="photoInput"
                      name="photo"
                      accept=".png, .jpg, .jpeg,capture=camera"
                      onChange={onPhotoChange}
                      className="hidden"
                    />
                    <img
                      src={`${SERVER_URL}/images/${mentor?.photo}`}
                      className="mentor-photo h-40 w-40 rounded-full"
                      alt="Mentor"
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                      <button
                        className="text-white"
                        onClick={() => {
                          document.getElementById("photoInput").click(); // Trigger file input click
                        }}
                      >
                        Choose Photo
                      </button>
                      <button className="text-white ml-2" onClick={handleSave}>
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="relative">
                      <img
                        src={`${SERVER_URL}/images/${mentor?.photo}`}
                        className="mentor-photo h-40 w-40 rounded-full"
                        alt="Mentor"
                      />
                      <div className="absolute top-full left-0 w-full flex items-center justify-center bg-black bg-opacity-0 ">
                        <FiEdit
                          className="text-blue-800 text-2xl cursor-pointer"
                          onClick={() => handleEdit("photo")}
                        />
                        <p className="mt-2 ml-2 text-blue-800">Edit Photo</p>
                      </div>
                    </div>
                    <p className="mt-2">{photoFile ? photoFile.name : ""}</p>
                  </div>
                )}
              </div>

              <div className="mentor-details ml-4">
                <h3 className="text-xl font-bold flex items-center">
                  {editingField === "name" ? (
                    <>
                      <input
                        type="text"
                        className="block flex-1 rounded-full bg-grey-900 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        value={editedValue !== null ? editedValue : mentor.name} // Ensure the value is controlled
                        onChange={(e) => setEditedValue(e.target.value)} // Update the state on change
                      />

                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded-md ml-2"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      {mentor.name}
                      <FiEdit
                        className="text-blue-600 ml-1 cursor-pointer"
                        onClick={() => handleEdit("name")}
                      />
                    </>
                  )}
                </h3>

                <p className="flex items-center">
                  <span className="font-semibold">Phone:</span>{" "}
                  {editingField === "phone" ? (
                    <>
                      <input
                        type="text"
                        className="block flex-1 rounded-full bg-grey-900 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        value={
                          editedValue !== null ? editedValue : mentor.phone
                        } // Ensure the value is controlled
                        onChange={(e) => setEditedValue(e.target.value)} // Update the state on change
                      />

                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded-md ml-2"
                        onClick={() => handleSave("phone")} // Call handleSave with the field name
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-blue-600">{mentor.phone}</span>
                      <span className="ml-1">
                        <FiEdit
                          className="text-blue-600 cursor-pointer"
                          onClick={() => handleEdit("phone")}
                        />
                      </span>
                    </>
                  )}
                </p>

                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  <span className="text-blue-600">{mentor.email}</span>
                </p>
                <p>
                  <span className="font-semibold">Registration Number:</span>{" "}
                  <span className="text-blue-600">{mentor.regnumber}</span>
                </p>
                <p className="flex items-center">
                  <span className="font-semibold">Instagram Id:</span>{" "}
                  {editingField === "instagram" ? (
                    <>
                      <input
                        type="text"
                        className="block flex-1 rounded-full bg-grey-900 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        value={
                          editedValue !== null
                            ? editedValue
                            : mentor.socialMedia?.instagram
                        } // Ensure the value is controlled
                        onChange={(e) => setEditedValue(e.target.value)} // Update the state on change
                      />

                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded-md ml-2"
                        onClick={() => handleSave("instagram")} // Call handleSave with the field name
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-blue-600">
                        {mentor.socialMedia?.instagram}
                      </span>
                      <span className="ml-1">
                        <FiEdit
                          className="text-blue-600 cursor-pointer"
                          onClick={() => handleEdit("instagram")}
                        />
                      </span>
                    </>
                  )}
                </p>
                <p className="flex items-center">
                  <span className="font-semibold">Linkedin Id:</span>{" "}
                  {editingField === "linkedin" ? (
                    <>
                      <input
                        type="text"
                        className="block flex-1 rounded-full bg-grey-900 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        value={
                          editedValue !== null
                            ? editedValue
                            : mentor.socialMedia?.linkedin
                        } // Ensure the value is controlled
                        onChange={(e) => setEditedValue(e.target.value)} // Update the state on change
                      />

                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded-md ml-2"
                        onClick={() => handleSave("instagram")} // Call handleSave with the field name
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-blue-600">
                        {mentor.socialMedia?.linkedin}
                      </span>
                      <span className="ml-1">
                        <FiEdit
                          className="text-blue-600 cursor-pointer"
                          onClick={() => handleEdit("linkedin")}
                        />
                      </span>
                    </>
                  )}
                </p>
                <p className="flex items-center">
                  <span className="font-semibold">Branch:</span>{" "}
                  {editingField === "branch" ? (
                    <>
                      <div className="mt-2">
                        <select
                          name="role"
                          id="role"
                          value={
                            editedValue !== null ? editedValue : mentor?.branch
                          }
                          onChange={(e) => setEditedValue(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option value="">Select Role</option>
                          {Object.values(BRANCH).map((role, index) => (
                            <option key={index} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded-md ml-2"
                        onClick={() => handleSave("branch")} // Call handleSave with the field name
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-blue-600">{mentor?.branch}</span>
                      <span className="ml-1">
                        <FiEdit
                          className="text-blue-600 cursor-pointer"
                          onClick={() => handleEdit("branch")}
                        />
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <p>Your data is not available.</p>
          )}
        </div>

        <div className="class-schedule-container ml-6">
          <h2 className="schedule-title text-center font-bold underline underline-offset-8">
            Your Class Schedule
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
              Your Line Schedule
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
