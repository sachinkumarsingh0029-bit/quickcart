import React, { useEffect } from "react";
import Sidebar from "../../components/profile-ui/Sidebar";
import withAuth from "../../hoc/withAuth";
import FloatingButton from "../../components/common/FloatingButton";
import { useDispatch } from "react-redux";
import instance from "../../utils/Axios";
import { loginSuccess, logoutSuccess } from "../../redux/user/userSlice";

const Profile = () => {
  const dispatch = useDispatch();

  const checkAuth = async () => {
    const response = await instance.get("/auth/check");
    console.log(response.data);
    if (response.data.status === "success") {
      dispatch(loginSuccess(response.data));
    } else {
      dispatch(logoutSuccess());
    }
  };

  useEffect(() => {
    try {
      checkAuth();
    } catch (err) {
      dispatch(logoutSuccess());
    }
  }, []);
  
  return (
    <div>
      <Sidebar />
      <FloatingButton />
    </div>
  );
};

export default withAuth(Profile);
