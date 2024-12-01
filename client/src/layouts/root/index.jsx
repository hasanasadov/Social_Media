import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import React from "react";

import { MobileNavigation } from "@/components/shared/mobile-navigation";
import { Sidebar } from "@/components/shared/sidebar";
import { PostActionDialog } from "@/components/shared/post-action-dialog";
import {
  clearAuth,
  getCurrentUserAsync,
  selectUser,
} from "@/store/auth/authSlice";
import { PATHS } from "@/constants/paths";
import { useDispatch } from "react-redux";

const RootLayout = () => {
  const { user, loading } = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUserAsync());

    // return () => {
    //   dispatch(clearAuth());
    // };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={PATHS.LOGIN} />;
  }

  return (
    <div className="md:flex">
      <Sidebar />
      <div className={`md:w-[calc(100%-240px)] `}>
        <Outlet />
      </div>
      <PostActionDialog />
      <MobileNavigation />
    </div>
  );
};

export default RootLayout;
