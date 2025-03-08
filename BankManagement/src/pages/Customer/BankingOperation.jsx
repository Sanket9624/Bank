import React, { useState } from "react";
import { Card, Form, Input, Button, message, Row, Col } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, SwapOutlined } from "@ant-design/icons";
import { depositMoney, withdrawMoney, transferMoney } from "../../services/userService";
import "@ant-design/v5-patch-for-react-19";
import { useSelector } from "react-redux";

const BankingOperations = () => {
  const { token } = useSelector((state) => state.auth);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [receiver, setReceiver] = useState("");

  const handleDeposit = async () => {
    try {
      await depositMoney(token, depositAmount);
      message.success("Deposit successful");
      setDepositAmount("");
    } catch {
      message.error("Failed to deposit");
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdrawMoney(token, withdrawAmount);
      message.success("Withdrawal successful");
      setWithdrawAmount("");
    } catch {
      message.error("Failed to withdraw");
    }
  };

  const handleTransfer = async () => {
    try {
      await transferMoney(receiver ,transferAmount);
      message.success("Transfer successful");
      setTransferAmount("");
      setReceiver("");
    } catch {
      message.error("Failed to transfer");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} lg={8}>
          <Card title={<span>Deposit Funds <ArrowDownOutlined className="text-green-500" /></span>} bordered>
            <Form layout="vertical">
              <Form.Item label="Amount" required>
                <Input placeholder="₹ Enter amount" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" className="bg-green-500" block onClick={handleDeposit}>
                  ✅ Deposit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card title={<span>Withdraw Funds <ArrowUpOutlined className="text-red-500" /></span>} bordered>
            <Form layout="vertical">
              <Form.Item label="Amount" required>
                <Input placeholder="₹ Enter amount" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
              </Form.Item>
              <Form.Item>
                <Button danger block onClick={handleWithdraw}>
                  ❌ Withdraw
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} sm={24} lg={8}>
          <Card title={<span>Transfer Money <SwapOutlined className="text-blue-500" /></span>} bordered>
            <Form layout="vertical">
              <Form.Item label="Recipient Account" required>
                <Input placeholder="Enter account number" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
              </Form.Item>
              <Form.Item label="Amount" required>
                <Input placeholder="₹ Enter amount" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" className="bg-blue-500" block onClick={handleTransfer}>
                  🚀 Transfer
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BankingOperations;
