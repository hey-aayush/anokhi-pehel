import styles from "../../style";
import { ANOKHIPEHEL } from "../../assets/Home";

const Hero = () => {
  return (
    <div
      className={`relative ${styles.flexStart} overflow-hidden mb-10 border-4 border-teal-500`}
      style={{
        borderRadius: "40px", // Rounded corners
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="w-full h-full object-cover lg:w-[1400px] lg:h-[700px]"
        style={{
          borderRadius: "36px", // Slightly smaller to avoid spilling over border
          objectFit: "cover",
        }}
      >
        <source src={ANOKHIPEHEL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Hero;
