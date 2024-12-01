import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { getCurrentUserAsync, selectUser } from "@/store/auth/authSlice";
import { Navigate } from "react-router-dom";
import { PATHS } from "@/constants/paths";

const AuthLayout = () => {
  const { user, loading } = useSelector(selectUser);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUserAsync());
  },[]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to={PATHS.HOME} />;
  }

  return <Outlet />;
};

export default AuthLayout;
