import React from "react";
import styles from "../../style";
import { useNavigate } from "react-router-dom";
import { antyodaya } from "../../assets/Home";
import Button from "./Button";
import { motion } from "framer-motion";

const Antyodaya = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 50, duration: 0.8 }}
      viewport={{ once: true }}
      className={`group ${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-gray-200 rounded-[20px] box-shadow border-2 border-teal-200`}
    >
      {/* Image Section */}
      <div className={`${styles.flexCenter} sm:mr-10 mr-0 sm:mt-0 mt-10`}>
        <img
          src={antyodaya}
          alt="Antyodaya"
          className="w-[400px] h-[270px] object-cover rounded-lg"
        />
      </div>

      {/* Text Section with hover border effect */}
      <div className="flex-1 flex flex-col border-2 border-transparent transition-all duration-300 rounded-[20px] p-4">
        <h2 className={`${styles.heading2} text-center inline-block border-b-0 group-hover:border-b-4 group-hover:border-black transition-all duration-300`}>
          Antyodaya
        </h2>

        <p className={`${styles.paragraph} !text-black max-w-[600px] mt-5 mb-10`}>
          Antyodaya is the annual fest organized by{" "}
          <span className="font-bold text-gray-900">Anokhi पहल</span>, providing an incredible platform
          for children to explore, learn, and compete. With participation from over 30 schools,
          it hosts a variety of cultural, educational, science, and art events. The fest aims to
          encourage creativity, foster competitive spirit, and enhance the overall learning experience,
          ensuring students from diverse backgrounds get a chance to shine and grow.
        </p>

        <Button text="Let's Explore" func={() => navigate("/Antyodaya")} />
      </div>
    </motion.section>
  );
};

export default Antyodaya;
