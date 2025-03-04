import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaCalendar } from "react-icons/fa";
import { Form, Input, Button, Select, message } from "antd";

const { Option } = Select;

const Register = () => {
  const { handleSubmit, setValue } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);
        message.success("Registration successful! Please log in.");
        navigate("/login");
      }
     catch (error) {
      console.error("Registration failed", error);
      message.error("An error occurred. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    setValue(e.target.name, e.target.value);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
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
      </div>
    </div>
  );
};

export default Register;
