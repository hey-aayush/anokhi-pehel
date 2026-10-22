import "../../styles/DashboardStyles.css";
import PropTypes from "prop-types";
import { FiSettings } from "react-icons/fi";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector } from "react-redux";

const DashboardLayout = ({ children }) => {
  const { activeMenu } = useSelector((state) => state.dashboardContext);
  return (
    <div className="flex relative dark:bg-main-dark-bg">
      {/* Setting button  */}
      <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
        <button
          type="button"
          style={{ background: "#03C9D7", borderRadius: "50%" }}
          className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
        >
          <FiSettings />
        </button>
      </div>

      {activeMenu ? (
        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
          <Sidebar />
        </div>
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg">
          <Sidebar />
        </div>
      )}
      <div
        className={
          activeMenu
            ? "dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full"
            : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
        }
      >
        <div className="fixed md:static navbar w-full bg-slate-900 ">
          <Navbar />
        </div>

        <div>{children}</div>
        <div className=" inset-x-0 m-90 mx-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export default DashboardLayout;
