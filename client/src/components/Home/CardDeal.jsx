import { useNavigate } from "react-router-dom";
import styles, { layout } from "../../style";
import Button from "./Button";

const CardDeal = () => {
  const navigate = useNavigate();
  const connectWithUs = () => {
    navigate("/connectWithUs");
  };
  return (
    <section className={layout.section}>
      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>
          Your contribution <br className="sm:block hidden" />
          makes the world better!
        </h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Your contribution is instrumental in making the world a better place.
        </p>

        <Button styles={`mt-10`} text="Contribute Now!" func={connectWithUs} />
      </div>

      <div className={layout.sectionImg}>
        <iframe
          className="w-full h-64 lg:h-80 aspect-auto lg:aspect-video px-8"
          src="https://www.youtube.com/embed/NxMhckSJEP4?rel=0"
          title="Anokhi Pehel"
          allowFullScreen=""
        ></iframe>
        {/* <img src={study3} alt="billing" className="w-[100%] h-[100%]" /> */}
      </div>
    </section>
  );
};

export default CardDeal;
