import styles from "../../style";
import HomePageLayout from "../../components/Home/HomePageLayout";
const App = () => (
  <HomePageLayout>
    <div className={`bg-primary ${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        {/* <div className="text-black text-center font-bold text-2xl md:text-3xl lg:text-4xl relative">
          <img
            src={connectWithUs}
            alt="Connect with Us"
            className="mx-auto w-full h-auto md:max-w-md lg:max-w-lg lg:w-full lg:h-full"
          />
          <h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            Connect with Us
          </h2>
        </div> */}

        {/* <p className="leading-relaxed p-4 md:p-8 lg:p-12 font-base md:font-medium text-center hover:text-blue-900 sm:text-xl text-base">
          Connect with us to help the society and make this world a better
          place. Fill the membership form and get a Membership ID.
        </p> */}
        <div className="container m-auto md:my-12 p-2 lg:px-40">
          <div className="justify-center items-center text-center md:p-4 p-2 lg:text-4xl font-medium text-3xl">
            Our Promise
          </div>
          <div className="flex mb-8 md:mb-12 px-3 justify-center">
            <div className="w-16 h-1 rounded-full bg-teal-500 inline-flex"></div>
          </div>
          <div className="text-gray-600 body-font w-full">
            <div className=" w-full p-1 hover:text-white">
              <div className="border-2 border-teal-200 p-2 h-full rounded-2xl bg-stone-50 hover:bg-teal-400 shadow-inner ">
                <h1 className="md:text-3xl text-2xl font-medium title-font text-gray-900 title-font mb-2 text-center italic ">
                  Zero funds organization
                </h1>
                <p className="leading-relaxed p-4 md:p-8 lg:p-12 font-base md:font-medium text-center hover:text-stone-100 sm:text-xl text-base">
                  Anokhi Pehel is a decentralized, zero funds platform with no
                  employees, office space, and insurance.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container m-auto md:my-12 p-2 lg:px-40">
          <div className="justify-center items-center text-center md:p-4 p-2 lg:text-4xl font-medium text-3xl">
            Ways to Help Children
          </div>
          <div className="flex mb-8 md:mb-12 px-3 justify-center">
            <div className="w-16 h-1 rounded-full bg-teal-500 inline-flex"></div>
          </div>
          {/* <div className="text-gray-600 body-font w-full flex justify-center"> */}
          <div className="text-gray-600 body-font lg:flex lg:justify-center">
            <div className=" w-full p-1 hover:text-white">
              <div className="border-2 border-teal-200 p-2 h-full rounded-2xl bg-stone-50 hover:bg-teal-400 shadow-inner ">
                <h1 className="md:text-3xl text-2xl font-medium title-font text-gray-900 title-font mb-2 text-center italic ">
                  Admit them to schools
                </h1>
                <p className="leading-relaxed p-4 md:p-8 lg:p-6 font-base md:font-medium text-center hover:text-stone-100 sm:text-xl text-base">
                  &quot;Support our cause to ensure education for all. Help us enroll
                  deserving children into schools, empowering their futures with
                  knowledge and opportunities.&quot;
                </p>
              </div>
            </div>
            <div className=" w-full p-1 hover:text-white">
              <div className="border-2 border-teal-200 p-2 h-full rounded-2xl bg-stone-50 hover:bg-teal-400 shadow-inner ">
                <h1 className="md:text-3xl text-2xl font-medium title-font text-gray-900 title-font mb-2 text-center italic ">
                  Distribute stationery
                </h1>
                <p className="leading-relaxed p-4 md:p-8 lg:p-6 font-base md:font-medium text-center hover:text-stone-100 sm:text-xl text-base">
                  Contribute stationery and brighten futures! Your support helps
                  provide essential tools for learning, nurturing the dreams of
                  underprivileged children towards a brighter tomorrow.&quot;
                </p>
              </div>
            </div>
            <div className=" w-full p-1 hover:text-white">
              <div className="border-2 border-teal-200 p-2 h-full rounded-2xl bg-stone-50 hover:bg-teal-400 shadow-inner ">
                <h1 className="md:text-3xl text-2xl font-medium title-font text-gray-900 title-font mb-2 text-center italic ">
                  Celebrate Your day with us
                </h1>
                <p className="leading-relaxed p-4 md:p-8 lg:p-6 font-base md:font-medium text-center hover:text-stone-100 sm:text-xl text-base">
                  &quot;Make your special day theirs too! Celebrate with
                  underprivileged children, spreading joy and creating
                  unforgettable memories that leave a lasting impact on their
                  lives and your heart.&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="flex mb-8 md:mb-12 px-3 justify-center"></div>
          <div className="text-gray-600 body-font flex flex-col items-center">
            <div className=" w-full p-1 hover:text-white">
              <div></div>
            </div>
            <div className=" w-full p-1 hover:text-white">
              <div className="border-2 border-teal-200 p-2 h-full rounded-2xl bg-stone-50 hover:bg-teal-400 shadow-inner ">
                <h1 className="md:text-3xl text-2xl font-medium title-font text-gray-900 title-font mb-2 text-center italic ">
                  Empower women
                </h1>
                <p className="leading-relaxed p-4 md:p-8 lg:p-6 font-base md:font-medium text-center hover:text-stone-100 sm:text-xl text-base">
                  &quot;Empower women with the essential tools for education and
                  success. Provide sanitary pads, enabling them to pursue
                  learning, work, and personal growth, fostering empowerment and
                  equality.&quot;
                </p>
              </div>
            </div>
            <div className=" w-full p-1 hover:text-white">
              <div>
                {/* <h1 className="md:text-3xl text-2xl font-medium title-font text-gray-900 title-font mb-2 text-center italic ">
                  Celebrate Your day
                </h1>
                <p className="leading-relaxed p-4 md:p-8 lg:p-6 font-base md:font-medium text-center hover:text-stone-100 sm:text-xl text-base">
                  Anokhi Pehel is a decentralized, zero funds platform with no
                  employees, office space, and insurance.
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-12 md:py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 md:mb-4 text-gray-900">
              Reach Out Us
            </h1>
            <div className="flex mt-0 mb-2 justify-center">
              <div className="w-16 h-1 rounded-full bg-teal-500 inline-flex"></div>
            </div>
          </div>
          <form>
            <div className="lg:w-1/2 md:w-2/3 mx-auto">
              <div className="flex flex-wrap -m-2">
                <div className="p-2 w-1/2">
                  <div className="relative">
                    <label
                      htmlFor="name"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Name"
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                </div>
                <div className="p-2 w-1/2">
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="E-mail"
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                </div>
                <div className="p-2 w-1/2">
                  <div className="relative">
                    <label
                      htmlFor="address"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Address
                    </label>
                    <input
                      type="address"
                      id="address"
                      name="address"
                      placeholder="eg- Allahabad"
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                </div>
                <div className="p-2 w-1/2">
                  <div className="relative">
                    <label
                      htmlFor="tel"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Phone number
                    </label>
                    <input
                      type="tel"
                      id="tel"
                      name="tel"
                      placeholder="eg : 9787876546"
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                </div>
                <div className="p-2 w-1/2">
                  <span className="leading-7 text-sm text-gray-600">
                    Alumni:
                  </span>
                  <div className="mt-2">
                    <label className="inline-flex items-center ">
                      <input
                        type="radio"
                        className="form-radio"
                        name="accountType"
                      />
                      <span className="ml-2 leading-7 text-sm text-gray-600">
                        Yes
                      </span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        className="form-radio"
                        name="accountType"
                      />
                      <span className="ml-2 leading-7 text-sm text-gray-600">
                        No
                      </span>
                    </label>
                  </div>
                </div>
                <div className="p-2 w-full">
                  <div className="relative">
                    <label
                      htmlFor="message"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Put your thoughts here."
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    ></textarea>
                  </div>
                </div>
                <div className="p-2 w-full">
                  <button className="flex mx-auto text-white bg-teal-500 border-0 py-2 px-8 focus:outline-none hover:bg-teal-600 rounded text-lg">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  </HomePageLayout>
);

export default App;
