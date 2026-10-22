import { MdOutlineCancel } from "react-icons/md";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsClicked } from "../../redux/features/navlinkSlice";
import { SERVER_URL } from "../../Service/helper";
import { FiEdit } from "react-icons/fi";
import { queryClient } from "../../queries/queryClient";
const Profile = () => {
  const currentColor = "#03C9D7";
  const currentColor2 = "#374151";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // logout funtion
  const handleLogout = () => {
    queryClient.clear();
    localStorage.clear();
    navigate("/");
  };
  const handleChangePassword = () => {
    navigate("/changePassword");
  };

  const handleClick = (clicked) => {
    dispatch(setIsClicked(clicked));
  };

  return (
    <div className="nav-item absolute right-1 top-16 bg-gray-100 p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-bold text-lg text-gray-600">User Profile</p>

        <Button
          icon={<MdOutlineCancel />}
          color="rgb(110 120 125)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
          custumFunc={() => handleClick("userProfile")}
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-20 w-20"
          src={`${SERVER_URL}/images/${user?.photo}`}
          alt="user-profile"
        />
        <div>
          <div className="flex items-center justify-between mx-auto">
            <p className="font-semibold text-xl mr-14"> {user?.name} </p>

            <Link
              to={`/editProfile?mentor._id=${user._id}`}
              className="text-sm flex items-center"
            >
              Edit
              <FiEdit className="ml-1" />
            </Link>
          </div>

          <p className="text-gray-600 text-sm"> {user.role} </p>
          <p className="text-gray-600 text-sm font-semibold"> {user?.email} </p>
        </div>
      </div>
      {/* <div>userProfileData</div> */}
      <div className="mt-1">
        <Button
          color="white"
          bgColor={currentColor}
          text="Logout"
          borderRadius="8px"
          width="full"
          custumFunc={handleLogout}
        />
      </div>
      <div className="mt-3">
        <Button
          color="white"
          bgColor={currentColor2}
          text="Change Password"
          borderRadius="10px"
          width="full"
          custumFunc={handleChangePassword}
        />
      </div>
    </div>
  );
};

export default Profile;
