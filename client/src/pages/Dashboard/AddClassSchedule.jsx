import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import axios from "axios";
import { classes, subjects } from "../../constants/Dashboard";
import { BASE_URL } from "../../../src/Service/helper";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import PageNotFound from "../Error404";
const AddClassSchedule = () => {
  const [userNames, setUserNames] = useState([]);
  const { user } = useSelector((state) => state.user);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [schedule, setSchedule] = useState({
    className: "",
    schedule: daysOfWeek.map((day) => ({
      day,
      subject: "",
      mentor: "",
      mentor1: "",
    })),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/mentorList`);
        setUserNames(response.data);
        // console.log(userNames);
      } catch (error) {
        console.log(error);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${BASE_URL}/addClassSchedule`, schedule)
      .then((res) => {
        console.log(res);
        // Check if the response indicates success (you should have a proper way to determine success)
        if (res.data === "Schedule Added") {
          alert("Schedule Added successfully!");
          setSchedule({
            className: "",
            schedule: daysOfWeek.map((day) => ({
              day,
              subject: "",
              mentor: "",
              mentor1: "",
            })),
          });
        }
      })
      .catch((err) => {
        alert("Schedule Already exist!");
        console.log("error", err);
      });
  };

  const onChange = (e, index) => {
    const updatedSchedule = { ...schedule };
    if (e.target.name === "className") {
      updatedSchedule.className = e.target.value;
    } else {
      updatedSchedule.schedule[index][e.target.name] = e.target.value;
    }
    setSchedule(updatedSchedule);
  };
  return (
    <>
      {user?.isAdmin === true ? (
        <DashboardLayout>
          <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* ... other form elements */}
              <div className="space-y-8">
                <div className="border-b border-gray-900/10 pb-8">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Add Class Schedule
                  </h2>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Class
                      </label>
                      <div className="mt-2">
                        <select
                          id="className"
                          name="className"
                          placeholder="Class Name"
                          value={schedule.className}
                          onChange={(e) => onChange(e, -1)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option value="">Select class</option>
                          {classes.map((item, index) => (
                            <option key={index} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Loop through schedule */}
                    {schedule.schedule.map((daySchedule, index) => (
                      <div className="sm:col-span-6" key={index}>
                        <label
                          htmlFor={`day${index}`}
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          {daySchedule.day}
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 sm:gap-y-0 sm:gap-x-6">
                          {/* Pickup select input */}
                          <div className="mt-2 sm:mt-0">
                            <label
                              htmlFor={`mentor${index}`}
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Mentor
                            </label>
                            <select
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                              name="mentor"
                              placeholder="Mentor"
                              value={daySchedule.mentor}
                              onChange={(e) => onChange(e, index)}
                            >
                              <option value="">Select a mentor</option>
                              {userNames
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((user) => (
                                  <option key={user._id} value={user._id}>
                                    {user.name}
                                  </option>
                                ))}
                            </select>
                          </div>

                          {/* Drop select input */}

                          <div className="mt-2 sm:mt-0">
                            <label
                              htmlFor={`mentor${index}`}
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Mentor1
                            </label>
                            <select
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                              name="mentor1"
                              placeholder="Mentor1"
                              value={daySchedule.mentor1}
                              onChange={(e) => onChange(e, index)}
                            >
                              <option value="">Select a mentor</option>
                              {userNames
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((user) => (
                                  <option key={user._id} value={user._id}>
                                    {user.name}
                                  </option>
                                ))}
                            </select>
                          </div>

                          <div className="mt-2 sm:mt-0">
                            <label
                              htmlFor={`mentor${index}`}
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Subject
                            </label>
                            <select
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                              name="subject"
                              placeholder="Subject"
                              value={daySchedule.subject}
                              onChange={(e) => onChange(e, index)}
                            >
                              <option value="">Select Subject</option>
                              {subjects
                                .sort((a, b) =>
                                  a.subject.localeCompare(b.subject)
                                )
                                .map((subject) => (
                                  <option key={subject.id} value={subject.id}>
                                    {subject.subject}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-x-0 sm:gap-x-6">
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
      ) : (
        <PageNotFound />
      )}
    </>
  );
};

export default AddClassSchedule;
