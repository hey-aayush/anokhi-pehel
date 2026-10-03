import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import React, { useState } from "react";
import axios from "axios";
import { times, eventGroup } from "../../constants/Dashboard";
import { useNavigate } from "react-router-dom";
import { event } from "../../constants/Dashboard";
import { BASE_URL } from "../../../src/Service/helper";
import { useSelector } from "react-redux";
import SuccessMessageModel from "../../components/Models/SuccessMessageModel";
import ErrorMessageModel from "../../components/Models/ErrorMessageModel";
const AddEvent = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [credentials, setCredentials] = useState({
    eventName: "",
    eventGroup: "",
    // eventDepartment: "",
    location: "",
    startTime: "",
    endTime: "",
    coordinator: "",
    phone: "",
    regNumber: "",
    festName: "Antyodaya2k24",
  });

  const submitEvent = () => {
    setIsSubmitting(true);
    axios
      .post(`${BASE_URL}/addEvent`, credentials)
      .then((response) => {
        console.log(response);

        if (response.status === 201) {
          setSuccessMessage("Event submitted successfully");
          setShowSuccess(true);
          setCredentials({
            eventName: "",
            eventGroup: "",
            location: "",
            time: "",
            coordinator: "",
            phone: "",
            regNumber: "",
            festName: "",
          });
        } else {
          setSuccessMessage("Event updated");
          setShowSuccess(true);
          setCredentials({
            eventName: "",
            eventGroup: "",
            location: "",
            time: "",
            coordinator: "",
            phone: "",
            regNumber: "",
            festName: "",
          });
        }
      })
      .catch((error) => {
        console.error("Error occurred:", error);
        if (error.response) {
          setErrorMessage(`Error: ${error.response.data.message || "Something went wrong"}`);
        } else if (error.request) {
          setErrorMessage("Error: No response from server. Please try again later.");
        } else {
          setErrorMessage("Error: Failed to send request.");
        }
        setShowError(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitEvent();
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  return (
    <DashboardLayout>
      {showSuccess && (
        <SuccessMessageModel
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <ErrorMessageModel
          isOpen={showError}
          onClose={() => setShowError(false)}
          onRetry={submitEvent}
          title="Submission Failed"
          message={errorMessage}
        />
      )}
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="space-y-8">
            <div className="border-b border-gray-900/10 pb-8">
              <h2 className="text-base font-bold leading-7 text-gray-900">
                Add Event
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Event Group
                  </label>
                  <div className="mt-2">
                    <select
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      name="eventGroup"
                      value={credentials.eventGroup}
                      onChange={onChange}
                    >
                      <option value="" disabled>
                        Select Group of Event
                      </option>
                      <option value="Group1">Group1</option>
                      <option value="Group2">Group2</option>
                      <option value="Group3">Group3</option>
                      <option value="Group4">Group4</option>
                      <option value="Group5">Group5</option>
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Event Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      name="eventName"
                      placeholder="Event Name"
                      value={credentials.eventName}
                      onChange={onChange}
                    />
                  </div>
                </div>

                {/* <div className="sm:col-span-2">
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Department of Event
                  </label>
                  <div className="mt-2">
                    <select
                      name="eventDepartment"
                      id="eventDepartment"
                      value={credentials.eventDepartment}
                      onChange={onChange}
                      placeholder="Class"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value="">Select Event Department</option>
                      {event.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.event}
                        </option>
                      ))}
                    </select>
                  </div>
                </div> */}
              </div>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Location of Event
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      name="location"
                      placeholder="Location of Event"
                      value={credentials.location}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Event Start Time
                  </label>
                  <div className="mt-2">
                    <select
                      name="startTime"
                      id="startTime"
                      value={credentials.startTime}
                      onChange={onChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value="">Select Event Start Time</option>
                      {times.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="endTime"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Event End Time
                  </label>
                  <div className="mt-2">
                    <select
                      name="endTime"
                      id="endTime"
                      value={credentials.endTime}
                      onChange={onChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value="">Select Event End Time</option>
                      {times.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Coordinator of Event
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      name="coordinator"
                      placeholder="Coordinator of Event"
                      value={credentials.coordinator}
                      onChange={onChange}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Contact of Coordinator
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      name="phone"
                      placeholder="phone"
                      value={credentials.phone}
                      onChange={onChange}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Coordinator's Registration Number
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      name="regNumber"
                      placeholder="Registration Number"
                      value={credentials.regNumber}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddEvent;
