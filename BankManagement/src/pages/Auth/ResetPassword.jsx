import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import { Form, Input, Button, message } from "antd";

const ResetPassword = () => {
  const { handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
    const [searchParams] = useSearchParams();
  const email = new URLSearchParams(location.search).get("email");
  const otp = searchParams.get("otp");

  console.log(otp);
  

  const onSubmit = async (data) => {
    try {
        console.log(otp);
        
      await resetPassword({ email, newPassword: data.password ,otp:otp});
      message.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      message.error("Failed to reset password.");
    }
  };

  const handleInputChange = (e) => {
    setValue(e.target.name, e.target.value);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6">Reset Password</h2>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="New Password" name="password" rules={[{ required: true, message: "Please enter your new password" }]}> 
            <Input.Password placeholder="New Password" name="password" onChange={handleInputChange} />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Reset Password
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
