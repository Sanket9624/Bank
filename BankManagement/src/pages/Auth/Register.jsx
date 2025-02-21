import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaCalendar } from "react-icons/fa";

const Register = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);
      if (response?.success) {
        alert("Registration successful! Please log in.");
        navigate("/login");
        reset();
      } else {
        alert(response?.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration failed", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6">Create Account</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                {...register("firstName")}
                placeholder="First Name"
                className="border pl-10 p-2 w-full rounded"
              />
            </div>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                {...register("lastName")}
                placeholder="Last Name"
                className="border pl-10 p-2 w-full rounded"
              />
            </div>
          </div>
          <div className="relative mb-4">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              {...register("email")}
              placeholder="Email address"
              className="border pl-10 p-2 w-full rounded"
            />
          </div>
          <div className="relative mb-4">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="border pl-10 p-2 w-full rounded"
            />
          </div>
          <div className="relative mb-4">
            <FaPhone className="absolute left-3 top-3 text-gray-400" />
            <input
              {...register("mobileNo")}
              placeholder="Mobile Number"
              className="border pl-10 p-2 w-full rounded"
            />
          </div>
          <div className="relative mb-4">
            <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
            <input
              {...register("address")}
              placeholder="Address"
              className="border pl-10 p-2 w-full rounded"
            />
          </div>
          <div className="relative mb-4">
            <FaCalendar className="absolute left-3 top-3 text-gray-400" />
            <input
              {...register("dateOfBirth")}
              type="date"
              className="border pl-10 p-2 w-full rounded"
            />
          </div>
          <select {...register("accountType")} className="border p-2 w-full rounded mb-4">
            <option value="savings">Savings Account</option>
            <option value="current">Current Account</option>
          </select>
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
            Create Account
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account? <a href="/login" className="text-blue-500">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
