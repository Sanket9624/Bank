import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../store/authSlice";
import { loginUser } from "../../services/authService";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const roleMapping = {
    1: "superadmin",
    2: "bankmanager",
    3: "customer",
  };

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
      const { token } = response;
      const decodedToken = jwtDecode(token);
      const role = roleMapping[decodedToken.RoleId] || "customer";
      dispatch(loginSuccess({ user: decodedToken, token, role }));
      navigate(`/dashboard/${role}`);
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
            Sign In
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account? <a href="/register" className="text-blue-500">Create Account</a>
        </p>
      </div>
    </div>
  );
};

export default Login;