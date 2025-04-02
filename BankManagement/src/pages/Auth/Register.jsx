import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser, verifyOtp } from "../../services/authService";
import {
  Form,
  Input,
  Button,
  Typography,
  message,
  Modal,
  Spin,
  Select,
} from "antd";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import ReusableDatePicker from "../../Components/DatePicker";

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const { handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const otpParam = searchParams.get("otp");

    if (emailParam && otpParam) {
      setEmail(emailParam);
      setOtp(otpParam);
      setIsOtpModalVisible(true);
    }
  }, [searchParams]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await registerUser(data);
      if (response) {
        setEmail(data.email);
        message.success("OTP sent to your email for verification.");
        setIsOtpModalVisible(true);
      } else {
        message.error(
          response?.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Registration failed", error);
      message.error("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  const handleOtpVerification = async () => {
    setOtpLoading(true);
    try {
      const response = await verifyOtp({ email, otp }, "registration");
      if (response.isSuccess) {
        message.success(
          "Registration successful! Please wait for admin approval."
        );
        setIsOtpModalVisible(false);
        navigate("/login");
      } else {
        message.error(response.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP Verification failed", error);
      message.error("Invalid OTP. Please try again.");
    }
    setOtpLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <Title level={2} className="text-center mb-6">
          Create Account
        </Title>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input
              prefix={<FaUser />}
              placeholder="First Name"
              onChange={(e) => setValue("firstName", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input
              prefix={<FaUser />}
              placeholder="Last Name"
              onChange={(e) => setValue("lastName", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              prefix={<FaEnvelope />}
              placeholder="Email address"
              onChange={(e) => setValue("email", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<FaLock />}
              placeholder="Password"
              onChange={(e) => setValue("password", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Mobile Number"
            name="mobileNo"
            rules={[
              { required: true, message: "Please enter your mobile number" },
            ]}
          >
            <Input
              prefix={<FaPhone />}
              placeholder="Mobile Number"
              onChange={(e) => setValue("mobileNo", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input
              prefix={<FaMapMarkerAlt />}
              placeholder="Address"
              onChange={(e) => setValue("address", e.target.value)}
            />
          </Form.Item>

          {/* ✅ Updated DatePicker usage */}
          <Form.Item
            label="Date of Birth"
            name="dateOfBirth"
            rules={[
              { required: true, message: "Please enter your date of birth" },
            ]}
          >
            <ReusableDatePicker
              placeholder="Select Date of Birth"
              onChange={(date, dateString) =>
                setValue("dateOfBirth", dateString)
              }
              fullWidth={true}
            />
          </Form.Item>

          <Form.Item
            label="Account Type"
            name="accountType"
            rules={[
              { required: true, message: "Please select an account type" },
            ]}
          >
            <Select
              placeholder="Select Account Type"
              onChange={(value) => setValue("accountType", value)}
            >
              <Option value="savings">Savings Account</Option>
              <Option value="current">Current Account</Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" block disabled={loading}>
            {loading ? <Spin /> : "Create Account"}
          </Button>
        </Form>
        <Text className="text-center mt-4 block">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">
            Sign In
          </a>
        </Text>
      </div>
      <Modal
        title="Verify OTP"
        open={isOtpModalVisible}
        onCancel={() => setIsOtpModalVisible(false)}
        footer={null}
        centered
      >
        <Input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <Button
          type="primary"
          block
          className="mt-4"
          onClick={handleOtpVerification}
          disabled={otpLoading}
        >
          {otpLoading ? <Spin /> : "Verify OTP"}
        </Button>
      </Modal>
    </div>
  );
};

export default Register;
