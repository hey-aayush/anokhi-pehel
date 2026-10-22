import PropTypes from "prop-types";

const Button = ({
  icon,
  bgColor,
  color,
  bgHoverColor,
  size,
  text,
  borderRadius,
  width,
  custumFunc,
  className
}) => {
  return (
    <button
      type="button"
      onClick={()=>custumFunc()}
      style={{ backgroundColor: bgColor, color, borderRadius }}
      className={` text-${size} p-3 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor} ${className}`}
    >
      {icon} {text}
    </button>
  );
};

Button.propTypes = {
  icon: PropTypes.node,
  bgColor: PropTypes.string,
  color: PropTypes.string,
  bgHoverColor: PropTypes.string,
  size: PropTypes.string,
  text: PropTypes.node,
  borderRadius: PropTypes.string,
  width: PropTypes.string,
  custumFunc: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
