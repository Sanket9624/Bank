import React, { useState } from "react";
import { Card, Form, Input, Button, message, Row, Col } from "antd";
import { DollarOutlined, SendOutlined } from "@ant-design/icons";
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
      await transferMoney(token, receiver, transferAmount);
      message.success("Transfer successful");
      setTransferAmount("");
      setReceiver("");
    } catch {
      message.error("Failed to transfer");
    }
  };

  return (
    <div className="p-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card title="Deposit Funds" bordered>
            <Form layout="vertical">
              <Form.Item label="Amount" required>
                <Input
                  prefix={<DollarOutlined />}
                  placeholder="Enter Amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleDeposit} block>
                  Deposit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card title="Withdraw Funds" bordered>
            <Form layout="vertical">
              <Form.Item label="Amount" required>
                <Input
                  prefix={<DollarOutlined />}
                  placeholder="Enter Amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button danger onClick={handleWithdraw} block>
                  Withdraw
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} sm={24} lg={8}>
          <Card title="Transfer Money" bordered>
            <Form layout="vertical">
              <Form.Item label="Receiver Account Number" required>
                <Input
                  placeholder="Receiver Account Number"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Amount" required>
                <Input
                  prefix={<SendOutlined />}
                  placeholder="Enter Amount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleTransfer} block>
                  Transfer
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
