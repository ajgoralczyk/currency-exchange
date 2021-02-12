import React, { useState, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import axios from "axios";
import CurrencyPicker from "./CurrencyPicker.js";
import { LoadingOutlined } from "@ant-design/icons";

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

  function getExchangeRates() {
    setStatus("pending");
    axios
      .get(
        `https://api.exchangeratesapi.io/history?start_at=2018-01-01&end_at=${latest}&base=${fromCurrency}&symbols=${toCurrency}`
      )
      .then(res => {
        let data = res?.data;
        setExchangeDate(data?.date ?? "--");
        setHistory(data?.rates ?? 1);
        setStatus("done");
      });
  }

  const handleFromChange = curr => {
    setFromCurrency(curr);
  };

  const handleToChange = curr => {
    setToCurrency(curr);
  };

  useEffect(() => {
    getExchangeRates();
  }, [fromCurrency, toCurrency]);

  return (
    <>
      <h3>CURRENCY HISTORY</h3>
      <div className="exchange-setup">
        <CurrencyPicker options={avCurr} callback={handleFromChange} />
        <CurrencyPicker options={avCurr} callback={handleToChange} />
      </div>
      <div>AS OF {exchangeDate}</div>
      <div>
        {Object.keys(history).map((date, index) => {
          return (
            <div key={index}>
              {date} - {history[date][toCurrency]}
            </div>
          );
        })}
      </div>
    </>
  );
}
