import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../store/authSlice";
import { loginUser } from "../../services/authService";
import { Form, Input, Button, Typography, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Login = () => {
  const { handleSubmit, register, setValue } = useForm();
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
      if (response?.token) {
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <Title level={2} className="text-center mb-6">Sign In</Title>
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
          Don't have an account? <a href="/signup" className="text-blue-500">Create Account</a>
        </Typography.Text>
      </div>
    </div>
  );
};

export default Login;
