import React from "react";
import LeftSideBar from "../components/LeftSideBar";
import RightSideBar from "../components/RightSideBar";

const Notifications = () => {
  return (
    <div>
      <div>
        <div className="flex justify-between">
          <div>Notifications</div>
          <div>Settings</div>
        </div>
        <hr className="my-4 border-gray-500" />
        <div>
          <div className="flex">
            <img src="vite.svg" alt="" />
            <img src="avatar2.svg" className="w-10 h-10" alt="" />
          </div>
          <div>@johndoe followed you</div>
          <hr className="my-4 border-gray-500" />

          <div></div>
          <div className="flex">
            <img src="vite.svg" alt="" />
            <img src="avatar2.svg" className="w-10 h-10" alt="" />
          </div>
          <div>@janedoe liked your post</div>
          <hr className="my-4 border-gray-500" />
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
