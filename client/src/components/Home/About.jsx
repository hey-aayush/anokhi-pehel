import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { y: 100, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  transition: { duration: 1, ease: "easeOut" },
  viewport: { once: true, amount: 0.2 }
};

const AboutUs = () => (
  <section
    className="group py-2 bg-gray-100 min-h-screen border-2 border-teal-200 relative overflow-hidden rounded-lg mb-20"
    style={{ borderRadius: "40px" }}
  >
    {/* Title Section */}
    <motion.div
      {...fadeInUp}
      className="max-w-6xl mx-auto shadow-lg text-center rounded-lg p-4 mb-10 overflow-hidden"
      style={{ borderRadius: "40px" }}
    >
      <h1 className="font-poppins font-bold text-4xl sm:text-5xl text-gray-800 mb-6">
        About{" "}
        <span>
          <span className="font-bold text-gray-900">Anokhi</span>{" "}
          <span className="font-bold text-gray-900">पहल</span>
        </span>
      </h1>
      <p className="font-poppins text-lg sm:text-xl text-gray-900 leading-7">
        Anokhi पहल is an initiative started by a group of students from MNNIT, 
        aimed at helping underprivileged children access education. 
        What began with just a few teachers and 20 students has now grown into a team 
        of around 100 teachers, shaping the lives of over 400 students.
      </p>
    </motion.div>

    {/* What We Do */}
    <motion.div
      {...fadeInUp}
      className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-10 overflow-hidden border-2 border-transparent group-hover:border-teal-200 transition-all duration-300"
      style={{ borderRadius: "40px" }}
    >
      <h2 className="font-poppins font-semibold text-3xl sm:text-4xl text-gray-900 mb-2">
        What We Do
      </h2>
      <p className="font-poppins text-lg sm:text-xl text-gray-900 leading-7">
        At Anokhi पहल, we focus on more than just academics. Our teachers and volunteers 
        go beyond textbooks, teaching human and moral values. Alongside traditional subjects, 
        we offer computer and reasoning classes, equipping students with essential skills 
        for a brighter future.
      </p>
    </motion.div>

    {/* Evening Classes */}
    <motion.div
      {...fadeInUp}
      className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-10 overflow-hidden border-2 border-transparent group-hover:border-teal-200 transition-all duration-300"
      style={{ borderRadius: "40px" }}
    >
      <h2 className="font-poppins font-semibold text-3xl sm:text-4xl text-gray-900 mb-2">
        Evening Classes
      </h2>
      <p className="font-poppins text-lg sm:text-xl text-gray-900 leading-7">
        Student volunteers from MNNIT visit various locations daily and personally escort 
        students to classes. These volunteers dedicate two hours to teaching, covering 
        much more than what's found in textbooks. Our focus extends beyond academics, 
        instilling moral and human values in our students.
      </p>
    </motion.div>
  </section>
);

export default AboutUs;
