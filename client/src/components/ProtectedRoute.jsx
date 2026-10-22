import { useEffect } from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
import { BASE_URL } from "../../src/Service/helper";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const token = localStorage.getItem("token"); // Retrieve the stored token from localStorage
  const getUser = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.get(`${BASE_URL}/userData`, {
        headers: {
          Authorization: token,
        },
      });
      dispatch(hideLoading());
      // Check if the response is successful and the user is active
      if (res.data.success) {
        const fetchedUser = res.data.data;

        // Check if user is active
        if (fetchedUser.isActive) {
          dispatch(setUser(fetchedUser)); // Set the user data if active
        } else {
          // If user is not active, log them out
          localStorage.clear();
          return <Navigate to="/login" />;
        }
      } else {
        // Handle if the response was not successful
        localStorage.clear();
        return <Navigate to="/login" />;
      }
    } catch (error) {
      localStorage.clear();
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
