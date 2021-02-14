import React, { useState, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import axios from "axios";
import CurrencyPicker from "./CurrencyPicker.js";
import { LoadingOutlined } from "@ant-design/icons";
import { Table } from "antd";


export default function CurrencyRates(props) {
  const [avCurr, setAvCurr] = useState(["USD"]);
  const [currency, setCurrency] = useState("USD");
  const [status, setStatus] = useState("pending");
  const [rates, setRates] = useState({});
  const [exchangeDate, setExchangeDate] = useState("--");

  const handleCurrChange = curr => {
    setCurrency(curr);
  };

  useEffect(() => {
    setStatus("pending");
    axios
      .get(`https://api.exchangeratesapi.io/latest?base=${currency}`)
      .then(res => {
        let data = res?.data;
        setRates(data?.rates ?? {});
        setExchangeDate(data?.date ?? "--");
        setAvCurr(Object.keys(data?.rates ?? {}));
        setStatus("done");
      });
  }, [currency]);

  const getRatesToDisplay = () => {
    if (status === "pending") {
      return <LoadingOutlined />;
    } else {
      let data = Object.keys(rates).map((rate, index) => {
        return {Currency: rate, Rate: Math.round(rates[rate] * 100) / 100, key: index}
      }).sort((a, b) => {return a['Currency'] < b['Currency'] ? -1 : 1});
      let columns = [
        {title:'Currency', dataIndex:'Currency'}, 
        {title:'Rate', dataIndex:'Rate'}
      ];
      return (
        <>
          <Table columns={columns} dataSource={data} pagination={false}/>
        </>
      );
    }
  }

  return (
    <>
      <h3>EXCHANGE RATES</h3>
      <CurrencyPicker options={avCurr} callback={handleCurrChange} />
      <div>AS OF {exchangeDate}</div>
      <div>{getRatesToDisplay()}</div>
    </>
  );
}
