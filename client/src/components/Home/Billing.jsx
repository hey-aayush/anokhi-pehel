import styles, { layout } from "../../style";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
const Billing = () => {
  const navigate = useNavigate();
  const connectWithUs = () => {
    navigate("/connectWithUs");
  };
  return (
    <section id="product" className={layout.sectionReverse}>
      <div className={layout.sectionImgReverse}>
        {/* <img src={study2} alt="billing" className="w-[100%] h-[100%] relative z-[5]" /> */}
        <iframe
          width="560"
          height="350"
          src="https://www.youtube.com/embed/n7Ay0eGLLjs?si=KLcKZlXT18IPrlqL"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>

        {/* gradient start */}
        <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
        <div className="absolute z-[0] w-[50%] h-[50%] -left-1/2 bottom-0 rounded-full pink__gradient" />
        {/* gradient end */}
      </div>

      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>
          Be the change <br className="sm:block hidden" /> you want to see in
          the world!
        </h2>
        <h6 className={`${styles.paragraph} max-w-[470px] mt-5`}>
          The 21st century demands responsible and proactive community
          engagement. We all have a role to play in driving the change we wish
          to see in our communities.
        </h6>
        <Button styles={`mt-10`} text="Connect With Us!" func={connectWithUs} />
        {/* <div className="flex flex-row flex-wrap sm:mt-10 mt-6">
        <img src={apple} alt="google_play" className="w-[128.86px] h-[42.05px] object-contain mr-5 cursor-pointer" />
        <img src={google} alt="google_play" className="w-[144.17px] h-[43.08px] object-contain cursor-pointer" />
      </div> */}
      </div>
    </section>
  );
};

export default Billing;
