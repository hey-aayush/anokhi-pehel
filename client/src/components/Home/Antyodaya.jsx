import React from "react";
import styles from "../../style";
import { useNavigate } from "react-router-dom";
import { antyodaya, Antyodayavid } from "../../assets/Home"; // Assuming this is the correct image path
import Button from "./Button"; // Uncomment if you use the button component

const Antyodaya = () => {
  const navigate = useNavigate();

  return (
    <section
      className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-gray-200 rounded-[20px] box-shadow`}
    >
      {/* Image Section - Adjusted to be on the left */}
      <div className={`${styles.flexCenter} sm:mr-10 mr-0 sm:mt-0 mt-10`}>
        <img
          src={Antyodayavid}
          alt="Antyodaya"
          className="w-[400px] h-[270px] object-cover rounded-lg"
        />
      </div>

      {/* Text Section */}
      <div className="flex-1 flex flex-col">
      <h2 className={`${styles.heading2} text-center`}>Antyodaya</h2>

        <p className={`${styles.paragraph} max-w-[600px] mt-5 mb-10`}>
          Antyodaya is the annual fest organized by Anokhi Pehel, providing an incredible platform for children to explore, learn, and compete. With participation from over 30 schools, it hosts a variety of cultural, educational, science, and art events. The fest aims to encourage creativity, foster competitive spirit, and enhance the overall learning experience, ensuring students from diverse backgrounds get a chance to shine and grow.
        </p>
        <Button text="Let's Explore" func={() => navigate('/Antyodaya')} />
      </div>
    </section>
  );
};

export default Antyodaya;
