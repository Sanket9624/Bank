import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyOtp } from "../../services/authService";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaCalendar } from "react-icons/fa";
import { Form, Input, Button, Select, message, Modal } from "antd";

const { Option } = Select;

const Register = () => {
  const { handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);
      console.log(response);

      if (response?.message === "OTP Sent to Email for Verification") {
        setEmail(data.email);
        message.success("OTP sent to your email for verification.");
        setIsOtpModalVisible(true); // Open modal for OTP input
      } else {
        message.error(response?.message || "Register failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration failed", error);
      message.error("An error occurred. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    setValue(e.target.name, e.target.value);
  };

  const handleOtpVerification = async () => {
    try {
      const response = await verifyOtp({ email, otp }, "registration");
      console.log("OTP Response:", response);

      if (response.isSuccess) {
        message.success("Registration successful! Please log in.");
        setIsOtpModalVisible(false);
        navigate("/login");
      } else {
        message.error(response.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP Verification failed", error);
      message.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100" style={{ backgroundImage: "url('../../../public/banking.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="bg-inherit bg-opacity-80 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6">Create Account</h2>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "Please enter your first name" }]}>
            <Input prefix={<FaUser />} placeholder="First Name" name="firstName" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Please enter your last name" }]}>
            <Input prefix={<FaUser />} placeholder="Last Name" name="lastName" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email" }]}>
            <Input prefix={<FaEnvelope />} placeholder="Email address" name="email" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]}>
            <Input.Password prefix={<FaLock />} placeholder="Password" name="password" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Mobile Number" name="mobileNo" rules={[{ required: true, message: "Please enter your mobile number" }]}>
            <Input prefix={<FaPhone />} placeholder="Mobile Number" name="mobileNo" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please enter your address" }]}>
            <Input prefix={<FaMapMarkerAlt />} placeholder="Address" name="address" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Date of Birth" name="dateOfBirth" rules={[{ required: true, message: "Please enter your date of birth" }]}>
            <Input prefix={<FaCalendar />} type="date" name="dateOfBirth" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Account Type" name="accountType" rules={[{ required: true, message: "Please select an account type" }]}>
            <Select placeholder="Select Account Type" onChange={(value) => setValue("accountType", value)}>
              <Option value="savings">Savings Account</Option>
              <Option value="current">Current Account</Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" className="w-full bg-green-500 text-white py-2 rounded">
            Create Account
          </Button>
        </Form>
        <div className="text-center mt-6">
          Already have an account? <a href="/login" className="text-blue-500">Sign In</a>
        </div>

        {/* OTP Modal */}
        <Modal
          title="Verify OTP"
          visible={isOtpModalVisible}
          onOk={handleOtpVerification}
          onCancel={() => setIsOtpModalVisible(false)}
          okText="Verify OTP"
        >
          <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
        </Modal>
      </div>
    </div>
  );
};

export default Register;
