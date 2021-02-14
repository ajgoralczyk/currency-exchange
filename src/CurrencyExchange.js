import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import axios from "axios";
import CurrencyPicker from "./CurrencyPicker.js";
import { LoadingOutlined } from "@ant-design/icons";
import { Table } from "antd";

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

  const handleAmountChange = event => {
    setAmount(event.target.value);
  };

  const getRatesToDisplay = () => {
    if (status === "pending") {
      return <LoadingOutlined />;
    } else {
      let data = Object.keys(rates).map((rate, index) => {
        return {
          Currency: rate, 
          Rate: Math.round(rates[rate] * 100) / 100, 
          Amount: Math.round(amount * rates[rate] * 100) / 100,
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
          <div>RESULT {Math.round(rate * amount * 100) / 100}</div>
          <div>Other Currencies:</div>
          <Table dataSource={data} columns={columns}  pagination={false}/>
        </>
      );
    }
  }

  return (
    <>
      <h3>CURRENCY EXCHANGE</h3>
      <div className="exchange-setup">
        <input onChange={handleAmountChange} value={amount} />
        <CurrencyPicker options={avCurr} callback={handleFromChange} />
        <CurrencyPicker options={avCurr} callback={handleToChange} />
      </div>
      <div>AS OF {exchangeDate}</div>

      {getRatesToDisplay()}
    </>
  );
}
