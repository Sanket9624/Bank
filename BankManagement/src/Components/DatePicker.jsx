import React from "react";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const DatePicker = ({ value, onChange, disabledDate }) => {
  return <RangePicker value={value} onChange={onChange} disabledDate={disabledDate} />;
};

export default DatePicker;