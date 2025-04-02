import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Typography,
  Space,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {
  depositMoney,
  withdrawMoney,
  transferMoney,
} from "../../services/userService";
import "@ant-design/v5-patch-for-react-19";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;

// Reusable Banking Action Component
const BankingAction = ({
  title,
  icon,
  bgColor,
  textColor,
  onSubmit,
  fields,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log(values);
      await onSubmit(values);
      message.success(`${title} successful`);
      form.resetFields();
    } catch (error) {
      message.error(`Failed to ${title.toLowerCase()}`);
    }
    setLoading(false);
  };
  return (
    <Card
      bordered={false}
      className={`shadow-lg transition-transform transform hover:scale-105 duration-300 rounded-xl p-5 border-l-4 border-${bgColor}-500`}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div
          className={`p-3 rounded-full bg-${bgColor}-100 text-${bgColor}-600`}
        >
          {icon}
        </div>
        <Text strong className={`text-xl text-${textColor}-600`}>
          {title}
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        {fields.map(({ label, name, placeholder }) => (
          <Form.Item
            key={name}
            label={<Text className="font-medium">{label}</Text>}
            name={name}
            rules={[
              {
                required: true,
                message: `Please enter ${label.toLowerCase()}`,
              },
            ]}
          >
            <Input placeholder={placeholder} className="rounded-lg" />
          </Form.Item>
        ))}
        <Form.Item
          label={<Text className="font-medium">Description</Text>}
          name="description"
        >
          <Input
            placeholder="Enter description (optional)"
            className="rounded-lg"
          />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          className={`bg-${bgColor}-500 hover:bg-${bgColor}-600 text-white font-semibold py-2`}
          loading={loading}
        >
          {title}
        </Button>
      </Form>
    </Card>
  );
};

const BankingOperations = () => {
  const { userId } = useSelector((state) => state.auth);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-blue-100 to-white flex justify-center">
      <div className="w-full max-w-6xl">
        <Title level={2} className="text-center mb-6 text-blue-800 font-bold">
          Banking Operations
        </Title>

        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} lg={8}>
            <BankingAction
              title="Deposit"
              icon={<ArrowDownOutlined className="text-green-600 text-xl" />}
              bgColor="green"
              textColor="green"
              onSubmit={({ amount, description }) =>
                depositMoney(userId, amount, description)
              }
              fields={[
                {
                  label: "Amount",
                  name: "amount",
                  placeholder: "₹ Enter amount",
                },
              ]}
            />
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <BankingAction
              title="Withdraw"
              icon={<ArrowUpOutlined className="text-red-600 text-xl" />}
              bgColor="red"
              textColor="red"
              onSubmit={({ amount, description }) =>
                withdrawMoney(userId, amount, description)
              }
              fields={[
                {
                  label: "Amount",
                  name: "amount",
                  placeholder: "₹ Enter amount",
                },
              ]}
            />
          </Col>

          <Col xs={24} sm={24} lg={8}>
            <BankingAction
              title="Transfer"
              icon={<SwapOutlined className="text-blue-600 text-xl" />}
              bgColor="blue"
              textColor="blue"
              onSubmit={({ recipient, amount, description }) =>
                transferMoney(recipient, amount, description)
              }
              fields={[
                {
                  label: "Recipient Account",
                  name: "recipient",
                  placeholder: "Enter account number",
                },
                {
                  label: "Amount",
                  name: "amount",
                  placeholder: "₹ Enter amount",
                },
              ]}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BankingOperations;
