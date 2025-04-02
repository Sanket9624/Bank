import { DatePicker } from "antd";
import dayjs from "dayjs";

const ReusableDatePicker = ({
  placeholder,
  value,
  onChange,
  disabledDate,
  fullWidth = false,
}) => {
  const style = fullWidth ? { width: "100%" } : {};

  const defaultDisabledDate = (current) => {
    if (!disabledDate) {
      return current && current > dayjs();
    }
    return disabledDate(current);
  };

  return (
    <DatePicker
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabledDate={defaultDisabledDate}
      style={style}
    />
  );
};

export default ReusableDatePicker;
