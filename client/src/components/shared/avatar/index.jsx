import { UserCircle2Icon } from "lucide-react";
import React from "react";

const Avatar = ({ user }) => {
  if (!user.avatar) {
    return <UserCircle2Icon className="w-9 h-9" />;
  }

  return (
    <img
      src={user.avatar}
      alt="User Avatar"
      className="w-8 h-8 rounded-full object-cover"
    />
  );
};

export default Avatar;
