import React, { useState, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import axios from "axios";
import CurrencyPicker from "./CurrencyPicker.js";
import { LoadingOutlined } from "@ant-design/icons";
import { Table } from "antd";

export default function CurrencyRates(props) {
  const [avCurr, setAvCurr] = useState(["USD"]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("USD");
  const [history, setHistory] = useState(1);
  const [latest, setLatest] = useState("2021-01-01");

  const [status, setStatus] = useState("pending");
  const [exchangeDate, setExchangeDate] = useState("--");

  useEffect(() => {
    axios.get(`https://api.exchangeratesapi.io/latest`).then(res => {
      setAvCurr(Object.keys(res?.data?.rates ?? {}));
      setLatest(res?.data?.date ?? "2021-01-01");
    });
  }, []);

  const handleFromChange = curr => {
    setFromCurrency(curr);
  };

  const handleToChange = curr => {
    setToCurrency(curr);
  };

  useEffect(() => {
    setStatus("pending");
    axios
      .get(
        `https://api.exchangeratesapi.io/history?start_at=2019-01-01&end_at=${latest}&base=${fromCurrency}&symbols=${toCurrency}`
      )
      .then(res => {
        let data = res?.data;
        setExchangeDate(data?.date ?? "--");
        setHistory(data?.rates ?? 1);
        setStatus("done");
      });
  }, [fromCurrency, toCurrency]);

  const getRatesToDisplay = () => {
    if (status === "pending") {
      return <LoadingOutlined />;
    } else {
      let data = Object.keys(history).map((date, index) => {
        return {
          Date: date,
          Rate: Math.round(history[date][toCurrency] * 100) / 100, 
          key: index
        }
      }).sort((a, b) => {return a['Date'] > b['Date'] ? -1 : 1});
      let columns = [
        {title:'Date', dataIndex:'Date'}, 
        {title:'Rate', dataIndex:'Rate'}
      ];
      return (
        <Table dataSource={data} columns={columns}  pagination={false}/>
      );
    }
  }

  return (
    <>
      <h3>CURRENCY HISTORY</h3>
      <div className="exchange-setup">
        <CurrencyPicker options={avCurr} callback={handleFromChange} />
        <CurrencyPicker options={avCurr} callback={handleToChange} />
      </div>
      <div>AS OF {exchangeDate}</div>
      {getRatesToDisplay()}
    </>
  );
}
