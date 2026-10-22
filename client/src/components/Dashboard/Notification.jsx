import { MdOutlineCancel } from "react-icons/md";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { setIsClicked } from "../../redux/features/navlinkSlice";

const Notification = () => {
  const currentColor = "#03C9D7";
  const dispatch = useDispatch();

  const handleClick = (clicked) => {
    dispatch(setIsClicked(clicked));
  };

  return (
    <div className="nav-item absolute right-5 md:right-40 top-16 bg-gray-100 p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <p className="font-bold text-lg text-gray-600">
            Notifications
          </p>
          <button
            type="button"
            className="text-gray-600 text-xs rounded p-1 px-2 bg-orange-theme "
          >
            {" "}
            5 New
          </button>
        </div>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(110 120 125)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
          custumFunc={() => {
            handleClick("notification");
          }}
        />
      </div>
      <div className="mt-5 ">
        No Notification
        <div className="mt-5">
          <Button
            color="white"
            bgColor={currentColor}
            text="See all notifications"
            borderRadius="10px"
            width="full"
          />
        </div>
      </div>
    </div>
  );
};

export default Notification;
