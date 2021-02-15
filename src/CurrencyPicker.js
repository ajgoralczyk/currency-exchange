import React from "react";
import "antd/dist/antd.css";
import "./App.css";
import { Select } from "antd";

const { Option } = Select;

export default function CurrencyPicker(props) {
  const availableCurrencies = props.options;

  const handleChange = value => {
    props.callback(value);
  };

  return (
    <Select
      defaultValue={availableCurrencies[0]}
      className="currency-picker"
      onChange={handleChange}
    >
      {availableCurrencies.map((curr, index) => {
        return (
          <Option key={index} value={curr}>
            {curr}
          </Option>
        );
      })}
    </Select>
  );
}
