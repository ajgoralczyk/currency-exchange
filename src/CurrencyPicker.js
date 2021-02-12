import React from "react";
import "./App.css";
import "antd/dist/antd.css";
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
      style={{ width: 120 }}
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
