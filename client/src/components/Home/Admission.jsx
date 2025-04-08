import React from "react";
import styles from "../../style";
import { useNavigate } from "react-router-dom";
import { BackToSchool } from "../../assets/Home";
import Button from "./Button";
import { motion } from "framer-motion";

const Admission = () => {
  const navigate = useNavigate();

  return (
    <section
      className={`group ${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-gray-200 rounded-[20px] transition-all duration-300 border-2 border-transparent hover:border-teal-400 box-shadow`}
    >
      {/* Text Section - Animate from Bottom */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="flex-1 flex flex-col"
      >
        {/* Heading with underline on hover */}
        <div className="text-center border-b-4 border-transparent group-hover:border-black inline-block w-fit mx-auto transition-all duration-300">
          <h2 className={`${styles.heading2}`}>Back To School</h2>
        </div>

        <p className={`${styles.paragraph} text-black max-w-[470px] mt-5 mb-10`}>
          Helping the needy get back to school by assisting them with admissions.
          These children are school dropouts due to various reasons such as financial,
          social, or family circumstances.
        </p>
        <Button text="Let's Explore" func={() => navigate("/backToSchool")} />
      </motion.div>

      {/* Image Section - Animate from Bottom */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}
      >
        <img
          src={BackToSchool}
          alt="Back to School"
          className="w-[400px] h-[300px] object-cover rounded-lg"
        />
      </motion.div>
    </section>
  );
};

export default Admission;
