import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../../style";
import Footer from "./Footer";
import Navbar from "./Navbar";
import BackgroundImage from "../../../src/assets/Home/backgroundImage.jpg";

const HomePageLayout = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);

  // Function to handle scroll event
  const handleScroll = () => {
    if (window.scrollY > 50) { // You can adjust the value for when you want the background to change
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  // Adding scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative bg-primary w-full overflow-hidden min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
         style={{ backgroundImage: `url(${BackgroundImage})`, opacity: 0.3 }}
      ></div>

      {/* Navbar with dynamic background */}
      <div
        className={`fixed top-0 left-0 w-full z-20 mt-2 transition-all duration-300 ${
          scrolled ? "bg-gray-200 bg-opacity-90" : "bg-transparent"
        }`}
        style={{ backdropFilter: "blur(10px)" }} // Optional blur effect
      >
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
            <Navbar />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div
        className={`relative z-10 bg-primary ${styles.paddingX} ${styles.flexCenter}`}
        style={{ paddingTop: "80px" }} // Adjust padding for the fixed navbar
      >
        <div className={`${styles.boxWidth}`}>
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
};

HomePageLayout.propTypes = {
  children: PropTypes.node,
};

export default HomePageLayout;
