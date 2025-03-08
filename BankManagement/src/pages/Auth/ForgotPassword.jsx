import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import { Form, Input, Button, message } from "antd";
import { MailOutlined } from "@ant-design/icons";

const ForgotPassword = () => {
  const { handleSubmit, setValue } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data);
      message.success("OTP sent to your email!");
      navigate(`/verify-otp?email=${data.email}`);
    } catch (error) {
      message.error("Email not found or error occurred.");
    }
  };

  const handleInputChange = (e) => {
    setValue(e.target.name, e.target.value);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6">Forgot Password</h2>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email" }]}> 
            <Input prefix={<MailOutlined />} placeholder="Email" name="email" onChange={handleInputChange} />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Send OTP
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;