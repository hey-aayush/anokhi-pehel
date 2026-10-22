import styles from "../../style";

const ContributeUs = () => {
  return (
    <section
      className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-gray-200 rounded-[20px] box-shadow`}
    >
      <div className="flex-1 flex flex-col">
        <h2 className={styles.heading2}>We will make the world better!</h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Generosity is not measured by the size of the gift, but by the heart
          that gives. Every contribution, no matter how small, ripples with the
          power to make a positive impact on the world.
        </p>
      </div>

      <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>
        {/* <Button text="Let's Contribute" func={connectWithUs} /> */}
      </div>
    </section>
  );
};

export default ContributeUs;
