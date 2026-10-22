import PropTypes from "prop-types";

const Header = ({ category, title }) => {
  return (
    <div className=" mb-10 mt-20 ml-4">
      <p className="text-lg text-gray-400">{category}</p>
      <p className="text-xl font-bold tracking-tight text-slate-900">{title}</p>
    </div>
  );
};

Header.propTypes = {
  category: PropTypes.string,
  title: PropTypes.string,
};

export default Header;
