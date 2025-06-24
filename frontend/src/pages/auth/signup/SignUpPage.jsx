import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IoLogoHackernews } from "react-icons/io";
import { MdEmail, MdPerson, MdLock, MdAccountCircle } from "react-icons/md";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const { mutate, isError, isPending } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, fullName, password }),
      });

      const data = await res.json();

      // Throw an error if the response is not ok or contains an error
      if (!res.ok || data.error) {
        const errorMessage = data.error || "Something went wrong";
        throw new Error(errorMessage);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Signup successful!");
      // You can redirect here, e.g., navigate("/login")
    },
    onError: (error) => {
      toast.error(error.message || "Signup failed");
      console.error("Signup error:", error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="flex justify-center h-screen gap-16 items-center">
        <div className="text-red-400">
          <IoLogoHackernews size={250} />
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="text-xl font-semibold mb-3">Join today.</div>
            <div className="flex flex-col gap-3">
              {/* Email */}
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="pl-10 border border-gray-300 bg-gradient-to-r from-red-200 via-red-300 to-red-400 py-2 rounded-md w-full"
                />
              </div>

              {/* Username */}
              <div className="relative">
                <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className="pl-10 border border-gray-300 bg-gradient-to-r from-red-200 via-red-300 to-red-400 py-2 rounded-md w-full"
                />
              </div>

              {/* Full Name */}
              <div className="relative">
                <MdAccountCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="pl-10 border border-gray-300 bg-gradient-to-r from-red-200 via-red-300 to-red-400 py-2 rounded-md w-full"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="pl-10 border border-gray-300 bg-gradient-to-r from-red-200 via-red-300 to-red-400 py-2 rounded-md w-full"
                />
              </div>
            </div>

            {/* Signup Button */}
            <div className="bg-gradient-to-r from-red-200 via-red-300 to-red-500 border rounded-2xl text-center py-2 my-4 hover:brightness-110 transition-all duration-150">
              <button type="submit">
                {isPending ? "Loading..." : "Sign Up"}
              </button>
            </div>

            {/* Already have an account? */}
            <div className="text-center">Already have an account?</div>

            {/* Signin Button */}
            <Link to="/login">
              <div className="bg-gradient-to-r from-red-200 to-red-500 border rounded-2xl text-center py-2 my-2 hover:brightness-110 transition-all duration-150">
                <button type="button">Sign In</button>
              </div>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
