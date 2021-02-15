import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./App.css";
import axios from "axios";
import CurrencyPicker from "./CurrencyPicker.js";
import { LoadingOutlined } from "@ant-design/icons";
import { Table, Typography, InputNumber } from "antd";

export default function CurrencyRates(props) {
  const [avCurr, setAvCurr] = useState(["USD"]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState(1);
  const [rates, setRates] = useState(1);

  const [status, setStatus] = useState("pending");
  const [exchangeDate, setExchangeDate] = useState("--");

  useEffect(() => {
    axios.get(`https://api.exchangeratesapi.io/latest`).then(res => {
      setAvCurr(Object.keys(res?.data?.rates ?? {}));
    });
  }, []);

  useEffect(() => {
    setStatus("pending");
    axios
      .get(`https://api.exchangeratesapi.io/latest?base=${fromCurrency}`)
      .then(res => {
        let data = res?.data;
        setExchangeDate(data?.date ?? "--");
        setRate(data?.rates[toCurrency] ?? 1);
        setRates(data?.rates ?? 1);
        setStatus("done");
      });
  }, [fromCurrency, toCurrency]);

  const handleFromChange = curr => {
    setFromCurrency(curr);
  };

  const handleToChange = curr => {
    setToCurrency(curr);
  };

  const handleAmountChange = value => {
    setAmount(value);
  };

  const getRatesToDisplay = () => {
    if (status === "pending") {
      return <LoadingOutlined />;
    } else {
      let data = Object.keys(rates).map((rate, index) => {
        return {
          Currency: rate, 
          Rate: rates[rate].toFixed(4), 
          Amount: (amount * rates[rate]).toFixed(2),
          key: index
        }
      }).sort((a, b) => {return a['Currency'] < b['Currency'] ? -1 : 1});
      let columns = [
        {title:'Currency', dataIndex:'Currency'}, 
        {title:'Rate', dataIndex:'Rate'},
        {title:'Amount', dataIndex:'Amount'}
      ];
      return (
        <>
          <Typography.Text>Other Currencies</Typography.Text>
          <Table dataSource={data} columns={columns} bordered={true} pagination={false}/>
        </>
      );
    }
  }

  return (
    <>
      <div className="overview">
        <div className="overview__block">
          {/* <input onChange={handleAmountChange} value={amount} /> */}
          <InputNumber min={1} defaultValue={amount} onChange={handleAmountChange} />
          <CurrencyPicker options={avCurr} callback={handleFromChange} />
          <CurrencyPicker options={avCurr} callback={handleToChange} />
        </div>
        <div className="overview__block">
          <div className="exchange-information">
            <Typography.Text type="secondary">Total amount in {toCurrency}</Typography.Text>
            <Typography.Title level={2}>{(rate * amount).toFixed(2)}</Typography.Title>
          </div>
          <div className="exchange-information">
            <Typography.Text type="secondary">Exchange rate</Typography.Text>
            <Typography.Title level={2}>{rate.toFixed(4)}</Typography.Title>
          </div>
        </div>
        <div className="overview__block">
          <Typography.Text strong className="overview__date">As of: {exchangeDate}</Typography.Text>
        </div>
      </div>
      {getRatesToDisplay()}
    </>
  );
}
