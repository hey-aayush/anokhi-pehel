import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BRANCH, ROLES } from "../../constants/Dashboard";
import "react-datepicker/dist/react-datepicker.css";
import { BASE_URL } from "../../Service/helper";

const JoinAsMentor = () => {
  // const { user } = useSelector((state) => state.user);
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    regnumber: "",
    phone: "",
    role: "Coordinator",
    photo: "",
    branch: "",
    isActive: "false",
  });

  const [acceptResponse, setAcceptResponse] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imageSize, setImageSize] = useState("");
  const WIDTH = 800;
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/settings`);
        if (response.data) {
          const setting = response.data.find(
            (item) => item.key === "isAcceptingResponse"
          );
          if (setting) {
            setAcceptResponse(setting.value); // Set the fetched setting value
            // console.log(isAcceptingResponse);
          }
        }
      } catch (error) {
        console.error("Error fetching settings", error);
      }
    };
    fetchSettings();
  }, []);

  // Resizing and setting photo
  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const imageUrl = event.target.result;
        const image = new Image();
        image.src = imageUrl;

        image.onload = () => {
          const canvas = document.createElement("canvas");
          const ratio = WIDTH / image.width;
          canvas.width = WIDTH;
          canvas.height = image.height * ratio;

          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          // Convert the canvas to a file
          canvas.toBlob(
            (blob) => {
              const resizedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            },
            "image/jpeg",
            0.98
          );
        };
      };
    });
  };

  const onPhotoChange = async (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      // Resize the image and update the credentials state
      const resizedImage = await resizeImage(imageFile);
      const sizeInKB = (resizedImage.size / 1024).toFixed(2); // Calculate size in KB
      setImageSize(`${sizeInKB} KB`);
      setCredentials({ ...credentials, photo: resizedImage });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(credentials.password)) {
      alert(
        "Password must contain at least 8 characters, including at least one lowercase letter, one uppercase letter, one number, and one special character."
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", credentials.name);
    formData.append("email", credentials.email);
    formData.append("phone", credentials.phone);
    formData.append("regnumber", credentials.regnumber);
    formData.append("password", credentials.password);
    formData.append("branch", credentials.branch);
    formData.append("role", credentials.role);
    formData.append("photo", credentials.photo);
    formData.append("isActive", credentials.isActive);
    axios
      .post(`${BASE_URL}/createUser`, formData)
      .then((res) => {
        console.log(res);

        if (res.data === "Mentor Added") {
          alert("Your request is successfully submitted ");

          setCredentials({
            name: "",
            email: "",
            phone: "",
            regnumber: "",
            password: "",
            branch: "",
            role: "",
            photo: "",
          });
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* {user?.isAdmin === true ? ( */}
      {acceptResponse ? (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="space-y-8">
              <div className="border-b border-gray-900/10 pb-8">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Join Us
                </h2>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Name
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          value={credentials.name}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"> */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="school"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="email"
                        id="email"
                        value={credentials.email}
                        onChange={onChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Phone
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={credentials.phone}
                        onChange={onChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="text-sm text-gray-500 mb-4">
                      Note: Password must contain at least 8 characters and
                      include characters like 123, ABC, abc, and @#$%.
                    </div>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          value={credentials.password}
                          onChange={onChange}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="pr-3 text-gray-500 rounded-e-md focus:outline-none focus:text-blue-600"
                        >
                          <svg
                            className="shrink-0 size-3.5"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            {showPassword ? (
                              <>
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </>
                            ) : (
                              <>
                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                <line x1="2" x2="22" y1="2" y2="22"></line>
                              </>
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="aadhar"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Registration Number
                    </label>
                    <div className="mt-2">
                      <input
                        id="regnumber"
                        name="regnumber"
                        type="text"
                        value={credentials.regnumber}
                        onChange={onChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="branch"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Branch
                    </label>
                    <div className="mt-2">
                      <select
                        name="branch"
                        id="branch"
                        value={credentials.branch}
                        onChange={onChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="">Select Branch</option>
                        {Object.values(BRANCH).map((branch, index) => (
                          <option key={index} value={branch}>
                            {branch}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Photo
                    </label>
                    <input
                      type="file"
                      name="photo"
                      accept=".png, .jpg, .jpeg,capture=camera"
                      // Specify 'camera' to use the device's camera
                      onChange={onPhotoChange}
                    />
                    {imageSize && (
                      <p className="text-sm mt-2 ">
                        Uploaded image size:{" "}
                        <span
                          className={
                            parseFloat(imageSize) > 1024
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          {imageSize}
                        </span>
                      </p>
                    )}
                    {parseFloat(imageSize) > 1024 && (
                      <p className="text-sm text-red-600 mt-1">
                        Please upload a compressed image.
                      </p>
                    )}
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
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white shadow-md rounded-md p-6 max-w-md text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              Sorry!
            </h1>
            <p className="text-gray-600">
              We are currently not accepting responses. Please contact the admin
              for assistance.
            </p>
          </div>
        </div>
      )}

      {/* // ) : ( // <PageNotFound />
      // )} */}
    </>
  );
};

export default JoinAsMentor;
