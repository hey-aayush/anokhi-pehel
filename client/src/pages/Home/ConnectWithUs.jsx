import React from "react";
import { motion } from "framer-motion";
import styles from "../../style";
import HomePageLayout from "../../components/Home/HomePageLayout";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const App = () => {
  return (
    <HomePageLayout>
      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>

          
          <motion.div
            className="container mx-auto my-12 p-4 lg:px-40"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-semibold text-center text-teal-600 mb-4 hover:scale-105 transition-transform duration-300">
              Our Promise
            </h2>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-1 rounded-full bg-teal-500"></div>
            </div>
            <div className="text-gray-700">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <div className="border-4 border-teal-200 p-6 rounded-3xl bg-stone-50 hover:bg-teal-400 hover:text-white shadow-2xl">
                  <h1 className="text-2xl md:text-3xl font-semibold text-center italic mb-4">
                    Zero funds organization
                  </h1>
                  <p className="text-base md:text-lg text-center">
                    Anokhi Pehel is a decentralized, zero funds platform with no
                    employees, office space, and insurance.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        
          <motion.div
            className="container mx-auto my-12 p-4 lg:px-40"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-semibold text-center text-teal-600 mb-4 hover:scale-105 transition-transform duration-300">
              Ways to Help Children
            </h2>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-1 rounded-full bg-teal-500"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center text-gray-700">
              {[
                {
                  title: "Admit them to schools",
                  desc: `Support our cause to ensure education for all. Help us enroll deserving children into schools, empowering their futures with knowledge and opportunities.`,
                },
                {
                  title: "Distribute stationery",
                  desc: `Contribute stationery and brighten futures! Your support helps provide essential tools for learning, nurturing the dreams of underprivileged children.`,
                },
                {
                  title: "Celebrate Your day with us",
                  desc: `Make your special day theirs too! Celebrate with underprivileged children, spreading joy and creating unforgettable memories.`,
                },
                {
                  title: "Empower women",
                  desc: `Empower women with the essential tools for education and success. Provide sanitary pads, enabling them to pursue learning, work, and growth.`,
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  className="transition duration-300 ease-in-out transform hover:scale-105 w-full max-w-md"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="border-4 border-teal-200 p-6 h-full rounded-3xl bg-stone-50 hover:bg-teal-400 hover:text-white shadow-2xl">
                    <h1 className="text-2xl md:text-3xl font-semibold text-center italic mb-4">
                      {card.title}
                    </h1>
                    <p className="text-base md:text-lg text-center">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      
      <motion.section
        className="text-gray-600 body-font relative bg-gray-50 py-12 md:py-24"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container px-5 mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">
              Reach Out To Us
            </h1>
            <div className="w-16 h-1 mx-auto bg-teal-500 rounded-full"></div>
          </div>
          <form>
            <div className="lg:w-1/2 md:w-2/3 mx-auto">
              <div className="flex flex-wrap -m-2">
                {[
                  { label: "Name", id: "name", type: "text", placeholder: "Name" },
                  { label: "Email", id: "email", type: "email", placeholder: "E-mail" },
                  { label: "Address", id: "address", type: "text", placeholder: "eg- Allahabad" },
                  { label: "Phone Number", id: "tel", type: "tel", placeholder: "eg : 9787876546" },
                ].map(({ label, id, type, placeholder }) => (
                  <div className="p-2 w-1/2" key={id}>
                    <div className="relative">
                      <label htmlFor={id} className="leading-7 text-sm text-gray-700">
                        {label}
                      </label>
                      <input
                        type={type}
                        id={id}
                        name={id}
                        placeholder={placeholder}
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-200 text-base outline-none text-gray-700 py-2 px-4 transition duration-200 ease-in-out"
                      />
                    </div>
                  </div>
                ))}

                <div className="p-2 w-1/2">
                  <span className="leading-7 text-sm text-gray-700">Alumni:</span>
                  <div className="mt-2">
                    <label className="inline-flex items-center mr-6">
                      <input type="radio" className="form-radio text-teal-500" name="alumni" />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" className="form-radio text-teal-500" name="alumni" />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>

                <div className="p-2 w-full">
                  <div className="relative">
                    <label htmlFor="message" className="leading-7 text-sm text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Put your thoughts here."
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-200 h-32 text-base outline-none text-gray-700 py-2 px-4 resize-none transition duration-200 ease-in-out"
                    ></textarea>
                  </div>
                </div>

                <div className="p-2 w-full">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    className="flex mx-auto text-white bg-teal-500 border-0 py-2 px-8 focus:outline-none hover:bg-teal-600 rounded-lg text-lg transition-all duration-300"
                  >
                    Connect
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </motion.section>
    </HomePageLayout>
  );
};

export default App;
