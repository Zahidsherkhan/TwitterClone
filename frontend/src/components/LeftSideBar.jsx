import React from "react";
import { Link } from "react-router-dom";
import { IoLogoHackernews } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import {
  Query,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

const LeftSideBar = () => {
  const queryClient = useQueryClient();

  const {
    mutate: logout,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    onSuccess: () => {
      toast.success("Logout successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  //  const data = {
  //   fullName: "John Doe",
  //   username: "johndoe",
  //   profileImg: "/avatars/boy1.png",
  //  };

  const { data: authData } = useQuery({ queryKey: ["authUser"] });

  return (
    <>
      <div className="ml-20 mt-5">
        <div>
          <Link to="/">
            <div className="flex  gap-2 mb-6 mt-2 items-center ">
              <IoLogoHackernews />
            </div>

            <div className="flex  gap-2 items-center hover:bg-red-300 duration-150 px-2 rounded-2xl">
              <IoHome />
              <div>Home</div>
            </div>
          </Link>

          <Link to="/notifications">
            <div className="flex  gap-2 items-center hover:bg-red-300 duration-150 px-2 rounded-2xl">
              <IoIosNotifications />
              <div>Notifications</div>
            </div>
          </Link>

          <Link to="/updateprofile">
            <div className="flex  gap-2 items-center hover:bg-red-300 duration-150 px-2 rounded-2xl">
              <MdAccountCircle />
              <div>Profile</div>
            </div>
          </Link>
        </div>
        <div>
          <button
            className="flex items-center gap-1 mt-80 cursor-pointer hover:bg-red-300 duration-150 px-2 rounded-2xl"
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            <div className="flex justify-center items-center gap-2 text-[10px] ">
              <div>
                <div>{authData.profileImg}Photo</div>
              </div>
              <div>
                <div className="font-semibold">{authData.fullName}</div>
                <div>{authData.username}</div>
              </div>
            </div>
            <BiLogOut />
          </button>
        </div>
      </div>
    </>
  );
};

export default LeftSideBar;
