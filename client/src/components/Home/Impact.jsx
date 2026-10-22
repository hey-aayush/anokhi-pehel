import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { features } from "../../constants/Home";
import styles, { layout } from "../../style";
import Button from "./Button";

const FeatureCard = ({ icon, title, content, index }) => (
  <div
    className={`flex flex-row p-6 rounded-[20px] ${
      index !== features.length - 1 ? "mb-6" : "mb-0"
    } feature-card`}
  >
    <div
      className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-gray-200`}
    >
      <img src={icon} alt="star" className="w-[50%] h-[50%] object-contain" />
    </div>
    <div className="flex-1 flex flex-col ml-3">
      <h4 className="font-poppins font-bold text-gray-600 text-[18px] leading-[23.4px] mb-1">
        {title}
      </h4>
      <p className="font-poppins font-normal text-dimWhite text-[16px] leading-[24px]">
        {content}
      </p>
    </div>
  </div>
);

FeatureCard.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  index: PropTypes.number,
};

const Impact = () => {
  const navigate = useNavigate();
  const handleStart = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/");
  };
  return (
    <section id="features" className={layout.section}>
      <div className={layout.sectionInfo}>
        <h3 className={styles.heading2}>
          Our Impact : Transforming <br className="sm:block hidden" />
          <span style={{ color: "cyan" }}>Lives</span>
          <span style={{ marginRight: "0.5rem" }}>,</span>
          <span style={{ color: "" }}>Changing</span>
          <span style={{ marginRight: "0.5rem" }}></span>
          <br className="sm:hidden block" />
          <span style={{ color: "cyan" }}>Society</span>.
        </h3>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Every small act of support can spark profound change. By investing
          time and effort in educating children, we pave the way for community
          upliftment and lasting transformation.
        </p>

        <Button styles={`mt-10`} text="Get started" func={handleStart} />
      </div>

      <div className={`${layout.sectionImg} flex-col`}>
        {features.map((feature, index) => (
          <FeatureCard key={feature.id} {...feature} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Impact;
