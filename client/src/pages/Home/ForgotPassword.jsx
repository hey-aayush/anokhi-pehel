import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Service/helper";
import { logo } from "../../assets/Home";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  //const [credentials, setCredentials] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form default behavior
    setLoading(true); // Dispatch showLoading to enable the loading state
    try {
      // Send forgot password request to backend
      const response = await axios.post(`${BASE_URL}/forgot-password`, {
        email,
      });
      console.log(response);
      setMessage(response.data.message);
      setTimeout(() => setMessage(""), 5000);
      //setMessage("Password reset instructions sent to your email.");
    } catch (error) {
      console.error("Error:", error.response.data);
      setMessage("Error occurred. Please try again.");
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false); // Dispatch hideLoading to disable the loading state
    }
  };
  const onChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <section className="">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 ">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-900"
        >
          <img className="w-8 h-8 mr-2" src={logo} alt="logo" />
          Anokhi पहल
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 border-double border-4 border-cyan-500">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Forgot Password
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={onChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required=""
                />
              </div>
              <div
                onClick={handleSubmit}
                className={`w-full text-center py-4 px-6 rounded-lg font-poppins text-[18px] cursor-pointer p-3  hover:drop-shadow-xl  
                  ${
                    loading
                      ? "bg-gray-400"
                      : "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700"
                  } 
                  text-white font-semibold ${
                    loading ? "cursor-not-allowed" : ""
                  }`}
                disabled={loading}
              >
                {loading ? "Loading..." : "Reset Password"}
              </div>
              {message && <p className="dark:text-white">{message}</p>}

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <a
                  href="#"
                  className="font-medium hover:underline text-cyan-800"
                >
                  Contact Admin
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
