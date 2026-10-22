import { useEffect } from "react";
import PropTypes from "prop-types";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
import { BASE_URL } from "../../src/Service/helper";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const token = localStorage.getItem("token");

  const getUser = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.get(`${BASE_URL}/userData`, {
        headers: {
          Authorization: token ? (token.startsWith("Bearer ") ? token : `Bearer ${token}`) : "",
        },
      });
      dispatch(hideLoading());

      if (res.data?.success) {
        const fetchedUser = res.data.data;
        if (fetchedUser.isActive) {
          dispatch(setUser(fetchedUser));
        } else {
          localStorage.clear();
          dispatch(setUser(null));
          navigate("/login");
        }
      } else {
        localStorage.clear();
        dispatch(setUser(null));
        navigate("/login");
      }
    } catch (error) {
      localStorage.clear();
      dispatch(setUser(null));
      dispatch(hideLoading());
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!user && token) {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
