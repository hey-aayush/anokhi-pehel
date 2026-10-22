import { useEffect } from "react";
import PropTypes from "prop-types";
import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";

import { useSelector, useDispatch } from "react-redux";
import {
  showSidebar,
  hideSidebar,
  setScreenSize,
} from "../../redux/features/dashboardSlice";
import { setIsClicked } from "../../redux/features/navlinkSlice";
import Chat from "./Chat";
import Notification from "./Notification";
import Profile from "./Profile";
import { SERVER_URL } from "../../Service/helper";
const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <button
    type="button"
    title={title}
    onClick={() => customFunc()}
    style={{ color }}
    className="relative text-xl rounded-full p-3 hover:bg-light-gray"
  >
    <span
      style={{ background: dotColor }}
      className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
    />
    {icon}
  </button>
);

NavButton.propTypes = {
  title: PropTypes.string,
  customFunc: PropTypes.func,
  icon: PropTypes.node,
  color: PropTypes.string,
  dotColor: PropTypes.string,
};

const Navbar = () => {
  const { activeMenu } = useSelector((state) => state.dashboardContext);

  const isClicked = useSelector((state) => state.navlinkContext);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleActiveMenu = () => {
    if (activeMenu) {
      dispatch(hideSidebar());
    } else {
      dispatch(showSidebar());
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const newScreenSize = window.innerWidth;
      dispatch(setScreenSize(newScreenSize));

      if (newScreenSize <= 1060) {
        dispatch(hideSidebar());
      } else {
        dispatch(showSidebar());
      }
    };

    window.addEventListener("resize", handleResize);

    // Initial setup
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  const handleClick = (clicked) => {
    // console.log(user);
    dispatch(setIsClicked(clicked));
  };

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        color="#03C9D7"
        icon={<AiOutlineMenu />}
      />

      <div className="flex">
        <NavButton
          title="Chat"
          dotColor="rgb(254, 201, 15)"
          customFunc={() => handleClick("chat")}
          color="#03C9D7"
          icon={<BsChatLeft />}
        />
        <NavButton
          title="Notification"
          dotColor="rgb(254, 201, 15)"
          customFunc={() => handleClick("notification")}
          color="#03C9D7"
          icon={<RiNotification3Line />}
        />
        <div
          className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
          onClick={() => handleClick("userProfile")}
        >
          <img
            className="rounded-full w-8 h-8"
            alt="user-profile"
            src={`${SERVER_URL}/images/${user?.photo}`}
          />
          <p>
            <span className="text-white text-14">Hi,</span>{" "}
            <span className="text-white font-bold ml-1 text-14">
              {user?.name}
            </span>
          </p>
          <MdKeyboardArrowDown className="text-gray-400 text-14" />
        </div>

        {isClicked.chat && <Chat />}
        {isClicked.notification && <Notification />}
        {isClicked.userProfile && <Profile />}
      </div>
    </div>
  );
};

export default Navbar;
