import styles from "../../style";
import { ANOKHIPEHEL } from "../../assets/Home";

const Hero = () => {
  return (
    <div
      className={`relative ${styles.flexStart} overflow-hidden rounded-lg mb-10`} // Apply rounded corners and hidden overflow
      style={{
        borderRadius: "40px", // Smooth curves
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="inset-0 w-full h-full object-cover lg:w-[1400px] lg:h-[700px]" // Responsive width and height for large screens
        style={{ objectFit: "cover" }} // Cover the viewport while maintaining aspect ratio
      >
        <source src={ANOKHIPEHEL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* About Antyodaya Image */}
    </div>
  );
};

export default Hero;
