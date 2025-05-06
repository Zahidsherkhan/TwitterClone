import React from "react";
import { IoLogoHackernews } from "react-icons/io";
import { MdEmail, MdLock } from "react-icons/md";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div>
      <div className="flex justify-center h-screen gap-16 items-center">
        {/* Logo */}
        <div className="text-red-400">
          <IoLogoHackernews size={250} />
        </div>

        {/* Login Form */}
        <div>
          <form>
            <div className="text-xl font-semibold mb-3">Welcome back.</div>
            <div className="flex flex-col gap-3">
              {/* Email */}
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Email"
                  className="pl-10 border border-gray-300 bg-gradient-to-r from-red-200 via-red-300 to-red-400 py-2 rounded-md w-full"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  placeholder="Password"
                  className="pl-10 border border-gray-300 bg-gradient-to-r from-red-200 via-red-300 to-red-400 py-2 rounded-md w-full"
                />
              </div>
            </div>

            {/* Login Button */}
            <div className="bg-gradient-to-r from-red-200 via-red-300 to-red-500 border rounded-2xl text-center py-2 my-4 hover:brightness-110 transition-all duration-150">
              <button>Login</button>
            </div>

            {/* Don't have an account? */}
            <div className="text-center">Don't have an account?</div>

            {/* Sign Up Button */}
            <Link to="/signup">
              <div className="bg-gradient-to-r from-red-200 to-red-500 border rounded-2xl text-center py-2 my-2 hover:brightness-110 transition-all duration-150">
                <button>Sign Up</button>
              </div>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
