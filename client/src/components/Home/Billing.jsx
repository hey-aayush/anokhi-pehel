import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles, { layout } from "../../style";
import Button from "./Button";

const Billing = () => {
  const navigate = useNavigate();
  const connectWithUs = () => {
    navigate("/connectWithUs");
  };

  return (
    <section id="product" className={`${layout.sectionReverse} group`}>
      {/* Video Section - Animate from Left */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60, duration: 0.8 }}
        viewport={{ once: true }}
        className={`${layout.sectionImgReverse} relative`}
      >
        <iframe
          width="560"
          height="350"
          src="https://www.youtube.com/embed/n7Ay0eGLLjs?si=KLcKZlXT18IPrlqL"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="rounded-xl"
        ></iframe>

        {/* gradient start */}
        <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
        <div className="absolute z-[0] w-[50%] h-[50%] -left-1/2 bottom-0 rounded-full pink__gradient" />
        {/* gradient end */}
      </motion.div>

      {/* Text Section - Animate from Right */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60, duration: 0.8 }}
        viewport={{ once: true }}
        className={layout.sectionInfo}
      >
        <div className="text-left border-b-4 border-transparent group-hover:border-black inline-block w-fit mb-3 transition-all duration-300">
          <h2 className={styles.heading2}>
            Be the change <br className="sm:block hidden" /> you want to see in
            the world!
          </h2>
        </div>

        <h6 className={`${styles.paragraph} max-w-[470px] mt-5`}>
          The 21st century demands responsible and proactive community
          engagement. We all have a role to play in driving the change we wish
          to see in our communities.
        </h6>

        <Button styles={`mt-10`} text="Connect With Us!" func={connectWithUs} />
      </motion.div>
    </section>
  );
};

export default Billing;
