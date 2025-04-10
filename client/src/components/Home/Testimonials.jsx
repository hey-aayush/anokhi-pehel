import { feedback } from "../../constants/Home";
import styles from "../../style";
import FeedbackCard from "./FeedbackCard";
import { motion } from "framer-motion";

const Testimonials = () => (
  <motion.section
    id="clients"
    initial={{ y: 100, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 1, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.3 }}
    className={`${styles.paddingY} ${styles.flexCenter} flex-col relative`}
  >
    {/* Title */}
    <div className="text-center mb-10">
      <h2 className="text-[26px] font-extrabold text-gray-500 underline underline-offset-8">
        Testimonials
      </h2>
    </div>

    {/* Feedback Cards Container */}
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl w-full px-4">
        {feedback.map((card) => (
          <motion.div
            key={card.id}
            className="transition-transform transform hover:scale-105 duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <FeedbackCard {...card} />
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

export default Testimonials;
