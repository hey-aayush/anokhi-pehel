import React from "react";
import { motion } from "framer-motion";

const Button = ({ styles, text, func }) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.1,
        transition: { type: "spring", stiffness: 300, damping: 15 },
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => func()}
      type="button"
      className={`py-4 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none ${styles}`}
    >
      {text}
    </motion.button>
  );
};

export default Button;
