import { useNavigate } from "react-router-dom";
import { study3 } from "../../assets/Home";
import styles, { layout } from "../../style";
import Button from "./Button";
import { motion } from "framer-motion";

const CardDeal = () => {
  const navigate = useNavigate();
  const connectWithUs = () => {
    navigate("/connectWithUs");
  };

  return (
    <section className={`${layout.section} group`}>
      {/* Text Section - Animate from Left */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60, duration: 0.8 }}
        viewport={{ once: true }}
        className={layout.sectionInfo}
      >
        <div className="text-left border-b-4 border-transparent group-hover:border-black inline-block w-fit mb-3 transition-all duration-300">
          <h2 className={styles.heading2}>
            Your contribution <br className="sm:block hidden" />
            makes the world better!
          </h2>
        </div>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Your contribution is instrumental in making the world a better place.
        </p>

        <Button styles={`mt-10`} text="Contribute Now!" func={connectWithUs} />
      </motion.div>

      {/* Video Section - Animate from Right */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60, duration: 0.8 }}
        viewport={{ once: true }}
        className={layout.sectionImg}
      >
        <iframe
          className="w-full h-64 lg:h-80 aspect-auto lg:aspect-video px-8 rounded-xl"
          src="https://www.youtube.com/embed/NxMhckSJEP4?rel=0"
          title="Anokhi Pehel"
          allowFullScreen
        ></iframe>
      </motion.div>
    </section>
  );
};

export default CardDeal;
