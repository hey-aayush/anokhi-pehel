import styles from "../../style";
import { useNavigate } from "react-router-dom";
import { BackToSchool } from "../../assets/Home"; // Assuming this is the correct image path
 import Button from "./Button"; // Uncomment if you use the button component

const Admission = () => {
  const navigate = useNavigate();

  return (
    <section
      className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-gray-200 rounded-[20px] box-shadow`}
    >
      {/* Text Section */}
      <div className="flex-1 flex flex-col">
        <h2 className={`${styles.heading2} text-center `}>Back To School</h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5 mb-10`}>
          Helping the needy get back to school by assisting them with admissions.
          These children are school dropouts due to various reasons such as financial,
          social, or family circumstances.
        </p>
        <Button text="Let's Explore" func={() => navigate('/backToSchool')} />
      </div>

      {/* Image Section */}
      <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>
        <img
          src={BackToSchool}
          alt="Back to School"
          className="w-[400px] h-[300px] object-cover rounded-lg"
        />
      </div>

      {/* Button Section */}
      <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>
        {/* Uncomment the button if you need it */}
        {/* <Button text="Let's Contribute" func={() => navigate('/contribute')} /> */}
      </div>
    </section>
  );
};

export default Admission;
