import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../store/authSlice";
import { loginUser, forgotPassword, verifyOtp } from "../../services/authService";
import { Form, Input, Button, Typography, message, Modal } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Login = () => {
  const { handleSubmit, setValue } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  const roleMapping = {
    1: "superadmin",
    2: "bankmanager",
    3: "customer",
  };

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
      if (response?.message === "OTP Sent for Verification. Please verify OTP to proceed.") {
        setEmail(data.email);
        message.info("OTP verification required");
        setOtpModalVisible(true);
      } else if (response?.token) {
        const { token } = response;
        const decodedToken = jwtDecode(token);
        const role = roleMapping[decodedToken.RoleId] || "customer";
        dispatch(loginSuccess({ user: decodedToken, token, role }));
        message.success("Login successful");
        navigate(`/dashboard/${role}`);
      } else {
        message.error(response?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login failed", error);
      message.error("An error occurred. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    setValue(e.target.name, e.target.value);
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      message.warning("Please enter your email");
      return;
    }
    try {
      const response = await forgotPassword({ email: forgotEmail });
      if (response?.message === "OTP Sent for Password Reset") {
        message.success("Password reset OTP sent to your email");
        setIsModalOpen(false);
        setOtpModalVisible(true);
      } else {
        message.error(response?.message || "Failed to send password reset email. Please try again.");
      }
    } catch (error) {
      console.error("Forgot password failed", error);
      message.error("Failed to send password reset email. Please try again.");
    }
  };

  const handleOtpVerification = async () => {
    try {
      const flowType = forgotEmail ? "forgotPassword" : "login";
      const currentEmail = forgotEmail || email; 
  
      const response = await verifyOtp({ email: currentEmail, otp }, flowType);
      console.log("OTP Response:", response);
  
      if (response.isSuccess && response.token) {
        const { token } = response;
        const decodedToken = jwtDecode(token);
        const role = roleMapping[decodedToken.RoleId] || "customer";
  
        // Store token in localStorage
        localStorage.setItem("token", token);
  
        // Dispatch action to Redux store
        dispatch(loginSuccess({ user: decodedToken, token, role }));
  
        message.success("OTP verified successfully!");
        setOtpModalVisible(false);
  
        // Navigate to dashboard based on role
        navigate(`/dashboard/${role}`);
      } else if(response.isSuccess) {
        navigate("/login");
        setOtpModalVisible(false);
        message.success("Password reset successful. Please login with your new password."); 
      }else{
        message.error(response.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification failed", error);
      message.error("Invalid OTP. Please try again.");
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-inherit bg-opacity-80 shadow-lg rounded-lg p-8 w-full max-w-md">
        <Title level={2} className="text-center mb-6">
          Sign In
        </Title>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email" }]}>
            <Input prefix={<MailOutlined />} placeholder="Email address" name="email" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" name="password" onChange={handleInputChange} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign In
          </Button>
        </Form>
        <Typography.Text className="text-center mt-4 block">
          <a onClick={() => setIsModalOpen(true)} className="text-blue-500 cursor-pointer">
            Forgot Password?
          </a>
        </Typography.Text>
        <Typography.Text className="text-center mt-4 block">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-500">
            Create Account
          </a>
        </Typography.Text>
      </div>

      {/* Forgot Password Modal */}
      <Modal title="Forgot Password" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Input placeholder="Enter your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
        <Button type="primary" block className="mt-4" onClick={handleForgotPassword}>
          Submit
        </Button>
      </Modal>

      {/* OTP Verification Modal */}
      <Modal
        title="OTP Verification"
        open={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        onOk={handleOtpVerification}
        okText="Verify OTP"
      >
        <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
      </Modal>
    </div>
  );
};

export default Login;
