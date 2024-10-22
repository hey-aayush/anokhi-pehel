import DashboardLayout from "./DashboardLayout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../Service/helper";

const ChangePassword = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    oldPassword: "",
    newPassword: "",
    userId: "",
  });
  useEffect(() => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      userId: user._id,
    }));
  }, [user._id]);
  //   console.log(user._id);
  const handleSubmit = (e) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(credentials.newPassword)) {
      alert(
        "New password must contain at least 8 characters, including at least one lowercase letter, one uppercase letter, one number, and one special character."
      );
      return;
    }

    axios
      .post(`${BASE_URL}/changePassword`, credentials)
      .then((res) => {
        console.log(res);
        if (res.data) {
          alert("Password changed successfully");
          localStorage.clear();
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log("error", err);
        // Handle error responses from the server, e.g., display error messages to the user
      });
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <DashboardLayout>
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="space-y-8">
              <div className="border-b border-gray-900/10 pb-8">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Change Your Password
                </h2>
                <div className="text-sm text-gray-500 mb-4">
                  Note: Password must contain at least 8 characters and include
                  characters like 123, ABC, abc, and @#$%.
                </div>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Old Password
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input
                          type="Password"
                          name="oldPassword"
                          id="oldPassword"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          value={credentials.oldPassword}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      New Password
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input
                          type="Password"
                          name="newPassword"
                          id="newPassword"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          value={credentials.newPassword}
                          onChange={onChange}
                        />
                      </div>
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
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
      {/* // ) : ( // <PageNotFound />
      // )} */}
    </>
  );
};

export default ChangePassword;
