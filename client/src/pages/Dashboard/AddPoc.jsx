import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../src/Service/helper";
import { useSelector } from "react-redux";
import SuccessMessageModel from "../../components/Models/SuccessMessageModel";
import ErrorMessageModel from "../../components/Models/ErrorMessageModel";
const AddPoc = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [credentials, setCredentials] = useState({
    school: "",
    nameOfPoc: "",
   contact:"",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the topic data to the server using Axios
    axios
      .post(`${BASE_URL}/addPoc`, credentials)
      .then((response) => {
        console.log(response);
        if (response.data === "Added") {
          setSuccessMessage("Poc Added successfully");
          setShowSuccess(true);
          setCredentials({
            school: "",
            nameOfPoc: "",
            contact: "",
          });
        } else {
          setSuccessMessage("Poc Updated");
          setShowSuccess(true);
          setCredentials({
            school: "",
            nameOfPoc: "",
            contact: "",
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Failed to save Point of Contact");
        setShowError(true);
      });
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
          onRetry={() => setShowError(false)}
          title="Submission Failed"
          message={errorMessage}
        />
      )}
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="space-y-8">
            <div className="border-b border-gray-900/10 pb-8">
              <h2 className="text-base font-bold leading-7 text-gray-900">
                Add Point of contact of Schools
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    School
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      name="school"
                      placeholder="Enter School Name"
                      value={credentials.school}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Name of Poc
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      name="nameOfPoc"
                      placeholder="Enter point of contact of the school"
                      value={credentials.nameOfPoc}
                      onChange={onChange}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Contact of poc
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      name="contact"
                      placeholder="Enter contact of the poc"
                      value={credentials.contact}
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
  );
};

export default AddPoc;
