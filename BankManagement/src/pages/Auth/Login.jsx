import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../store/authSlice";
import { loginUser } from "../../services/authService";
import { Form, Input, Button, Typography, message, Spin } from "antd";
import { MailOutlined, LockOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/login-animate.json";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const Login = () => {
  const { handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await loginUser(values); // Pass `values` instead of `data`
      if (response?.token) {
        const { token } = response;
        const decodedToken = jwtDecode(token);
        dispatch(loginSuccess({ user: decodedToken, token }));
        message.success("Login successful!");
        navigate(`/dashboard`);
      } else {
        message.error(response?.message || "Unexpected error. Try again.");
      }
    } catch (error) {
      message.error("An error occurred. Try again later.");
    }
    setLoading(false);
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#9333ea] dark:from-gray-900 dark:to-gray-950 px-4 relative">
      {/* Blurry Background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>

      {/* Glassmorphism Card */}
      <motion.div
        className="relative flex flex-col md:flex-row items-center justify-between bg-white/20 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-200/30 dark:border-gray-700/40 shadow-2xl rounded-3xl p-10 md:p-14 w-full max-w-4xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Dark Mode Toggle */}
        <button
          className="absolute top-4 right-6 p-2 rounded-full bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 shadow-lg transition-all"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <SunOutlined className="text-xl" /> : <MoonOutlined className="text-xl" />}
        </button>

        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <Title level={2} className="text-white dark:text-gray-200 font-bold text-4xl">
            Welcome Back!
          </Title>
          <Text className="text-gray-300 dark:text-gray-400 text-lg block mb-6">
            Sign in to your account
          </Text>

          <Form layout="vertical" onFinish={onSubmit} className="w-full"> 
  <Form.Item 
    label={<span className="text-white dark:text-gray-300 text-lg">Email</span>} 
    name="email" 
    rules={[{ required: true, message: "Enter your email" }]}
  >
    <Input 
      prefix={<MailOutlined className="text-gray-400 text-lg" />} 
      placeholder="Email address" 
      className="rounded-lg p-3 text-lg bg-gray-900/20 dark:bg-gray-700/30 border border-gray-300 dark:border-gray-600 text-white dark:text-gray-300 focus:ring-2 focus:ring-blue-400" 
    />
  </Form.Item>

  <Form.Item 
    label={<span className="text-white dark:text-gray-300 text-lg">Password</span>} 
    name="password" 
    rules={[{ required: true, message: "Enter your password" }]}
  >
    <Input.Password 
      prefix={<LockOutlined className="text-gray-400 text-lg" />} 
      placeholder="Password" 
      className="rounded-lg p-3 text-lg bg-gray-900/20 dark:bg-gray-700/30 border border-gray-300 dark:border-gray-600 text-white dark:text-gray-300 focus:ring-2 focus:ring-blue-400" 
    />
  </Form.Item>

  <Button 
    type="primary" 
    htmlType="submit" 
    block 
    disabled={loading} 
    className="mt-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all text-lg font-semibold rounded-lg py-3 shadow-lg"
  >
    {loading ? <Spin /> : "Sign In"}
  </Button>
</Form>


          {/* Links */}
          <Text className="mt-4 block text-gray-200 dark:text-gray-400 text-lg">
            <a href="/forgot-password" className="text-yellow-300 hover:text-yellow-200 transition-all underline font-medium">
              Forgot Password?
            </a>
          </Text>
          <Text className="mt-2 block text-gray-200 dark:text-gray-400 text-lg">
            Don't have an account?{" "}
            <a href="/signup" className="text-yellow-300 hover:text-yellow-200 transition-all underline font-medium">
              Sign Up
            </a>
          </Text>
        </div>

        {/* Right Side - Animation */}
        <motion.div
          className="w-1/2 hidden md:flex justify-center items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Lottie animationData={loginAnimation} loop autoPlay className="w-full max-w-sm drop-shadow-lg" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
