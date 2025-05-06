import React from "react";
import HomePage from "../pages/home/HomePage";

const Posts = () => {
  return (
    <div>
      <HomePage />
      <div>
        <div>
          <img
            src="avatar1.svg"
            className="w-10 h-10 border-0 rounded-full"
            alt=""
          />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-row gap-2">
            <div>Jane Red</div>
            <div>@janred</div>
            <div>20h</div>
          </div>
          <div>
            <button>Delete</button>
          </div>
        </div>

        <div className="flex justify-between">
          <div>comment 0</div>
          <div>Share 0</div>
          <div>likes 2</div>
          <div>Add to fav</div>
        </div>
      </div>
      <button class="btn btn-primary">Button</button>
    </div>
  );
};

export default Posts;
