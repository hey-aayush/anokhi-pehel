import React, { useState } from "react";
import styles from "../../style";
import HomePageLayout from "../../components/Home/HomePageLayout";
import { connectWithUs } from "../../assets/Home";

const ConnectWithUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    tel: "",
    alumni: "No",
    message: "",
  });

  const [loading, setLoading] = useState(false);  // Loading state
  const [success, setSuccess] = useState(null);   // Success state for handling messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading on submit

    try {
      const response = await fetch("http://localhost:8080/api/v1/email/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Email sent successfully!");
        setFormData({
          name: "",
          email: "",
          address: "",
          tel: "",
          alumni: "No",
          message: "",
        }); // Clear the form
      } else {
        setSuccess(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setSuccess("Failed to send email.");
    }

    setLoading(false);  // Stop loading after request completes
  };

  return (
    <HomePageLayout>
      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <div className="text-black text-center font-bold text-2xl md:text-3xl lg:text-4xl relative">
            <img
              src={connectWithUs}
              alt="Connect with Us"
              className="mx-auto w-full h-auto md:max-w-md lg:max-w-lg lg:w-full lg:h-full"
            />
            <h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              Connect with Us
            </h2>
          </div>

          <p className="leading-relaxed p-4 md:p-8 lg:p-12 font-base md:font-medium text-center hover:text-blue-900 sm:text-xl text-base">
            Connect with us to help society and make this world a better place. Fill the membership form and get a Membership ID.
          </p>

          {/* Show loading spinner if loading is true */}
          {loading && <div className="text-center text-teal-600">Sending email...</div>}

          {/* Show success or error message after submission */}
          {success && <div className={`text-center ${success.includes("Error") ? 'text-red-500' : 'text-teal-600'}`}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="lg:w-1/2 md:w-2/3 mx-auto">
              <div className="flex flex-wrap -m-2">
                <div className="p-2 w-1/2">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="p-2 w-1/2">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="E-mail"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="p-2 w-1/2">
                  <input
                    type="address"
                    id="address"
                    name="address"
                    placeholder="Address"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="p-2 w-1/2">
                  <input
                    type="tel"
                    id="tel"
                    name="tel"
                    placeholder="Phone number"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3"
                    value={formData.tel}
                    onChange={handleChange}
                  />
                </div>

                <div className="p-2 w-1/2">
                  <span className="leading-7 text-sm text-gray-600">Alumni:</span>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="alumni"
                        value="Yes"
                        onChange={handleChange}
                        checked={formData.alumni === "Yes"}
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        name="alumni"
                        value="No"
                        onChange={handleChange}
                        checked={formData.alumni === "No"}
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>

                <div className="p-2 w-full">
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Put your thoughts here."
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none"
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="p-2 w-full">
                  <button type="submit" className="flex mx-auto text-white bg-teal-500 border-0 py-2 px-8 focus:outline-none hover:bg-teal-600 rounded text-lg">
                    {loading ? "Connecting..." : "Connect"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </HomePageLayout>
  );
};

export default ConnectWithUs;
