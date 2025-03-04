import React from "react";
import { Button } from "antd";

const Button = ({ type, icon, label, onClick, block }) => {
  return (
    <Button type={type} icon={icon} onClick={onClick} block={block}>
      {label}
    </Button>
  );
};

export default Button;