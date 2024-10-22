// EditStudentPage.js
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { classes, locations, modes } from "../../constants/Dashboard";
import { BASE_URL } from "../../../src/Service/helper";
function EditStudentPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const studentId = searchParams.get("student._id");
  let navigate = useNavigate();
  const [student, setStudent] = useState({
    name: "",
    className: "",
    location: "",
    mode: "",
    phone: "",
    school: "",
    aadhar: "",
    dob: "",
    address: "",
    photo: "",
    active: "",
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/getstudentByUserId?studentid=${studentId}`
        );
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send request to update student data
      const response = await axios.put(
        `${BASE_URL}/updateStudent?studentid=${studentId}`,
        student
      );
      alert("Student updated successfully");
      navigate("/Students");
      // console.log("Student updated successfully:", response.data);
      // Redirect to student details page or show a success message
    } catch (error) {
      console.error("Error updating student:", error);
      // Show an error message to the user
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  return (
    <DashboardLayout>
      <div className="m-2 md:m-4 mt-20 p-2 md:p-10 bg-white rounded-3xl"></div>
      <h2 className="text-center font-bold">Edit Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="mt-10 pl-4 pr-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={student.name}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </label>
          </div>
          <div className="sm:col-span-2 sm:col-start-1">
            <label>
              Class:
              <select
                name="className"
                value={student.className}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select a class</option>
                {classes.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
                {/* Populate options dynamically */}
              </select>
            </label>
          </div>
          <div className="sm:col-span-2">
            <label>
              Location:
              <select
                name="location"
                value={student.location}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select Location</option>
                {locations.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.location}
                  </option>
                ))}
              </select>
              {/* {credentials.location === "other" && (
            <div className="mt-3">
              <label htmlFor="otherLocation" className="form-label">
                Other Location
              </label>
              <input
                type="text"
                className="form-control"
                name="otherLocation"
                placeholder="Other Location"
                value={credentials.otherLocation}
                onChange={onChange}
              />
            </div>
          )} */}
            </label>
          </div>
          <div className="sm:col-span-2 sm:col-start-1">
            <label>
              Mode:
              <select
                name="mode"
                value={student.mode}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select Mode</option>
                {modes.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.mode}
                  </option>
                ))}
                {/* Populate options dynamically */}
              </select>
            </label>
          </div>
          <div className="sm:col-span-2">
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={student.phone}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </label>
          </div>
          <div className="sm:col-span-2 sm:col-start-1">
            <label>
              School:
              <input
                type="text"
                name="school"
                value={student.school}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </label>
          </div>
          <div className="sm:col-span-2">
            <label>
              Aadhar Number:
              <input
                type="text"
                name="aadhar"
                value={student.aadhar}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </label>
          </div>
          <label>
            Date of Birth:
            <input
              type="date"
              name="dob"
              value={student.dob}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </label>
          <div className="sm:col-span-2 sm:col-start-1">
            <label>
              Complete Address:
              <textarea
                name="address"
                value={student.address}
                onChange={handleChange}
                rows={3}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </label>
          </div>
          <div className="sm:col-span-2 sm:col-start-1">
            <label>
              Active:
              <select
                name="active"
                id="active"
                value={student.active}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select Mode</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
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
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
      <div />
    </DashboardLayout>
  );
}

export default EditStudentPage;
