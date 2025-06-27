import React from "react";

const Profile = () => {
  return (
    <>
      <div>
        <div>
          <div className="flex gap-4">
            <div>Back</div>

            <div className="flex flex-col">
              <div>name</div>
              <div>No of posts</div>
            </div>
          </div>

          <div>
            <img src="bg-gray.jpg" className="w-150 h-30" alt="" />
          </div>

          <div className="flex justify-between mt-4">
            <div>
              <img
                src="avatar1.svg"
                alt=""
                className="w-30 -mt-14 ml-6 h-30 border-0 rounded-full"
              />
            </div>
            <div>
              <button className="bg-red-300 border-[0.5px] border-red-400 rounded px-2 py-1 cursor-pointer hover:bg-red-500 duration-150 text-sm">
                Edit Profile
              </button>
            </div>
          </div>
          <div>
            <div>Jane Red</div>
            <div>@janred</div>
            <div>Joined July 2024</div>
            <div className="flex gap-4">
              <div>3 Following</div>
              <div>1 Followers</div>
            </div>
          </div>
        </div>

        {/* Posts and Like Pages */}
        <div className="flex justify-around mt-6 bg-red-300 py-2">
          <Link to="/posts">
            <div className="border-[0.5] bg-red-400 px-2 rounded-sm">Posts</div>
          </Link>
          <Link to="/likes">
            <div className="border-[0.5px] bg-red-300 px-2 border-red-400 rounded-sm">
              Likes
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Profile;
