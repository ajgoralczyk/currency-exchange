import React, { useState, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import axios from "axios";
import CurrencyPicker from "./CurrencyPicker.js";
import { LoadingOutlined } from "@ant-design/icons";

export default function CurrencyRates(props) {
  const [avCurr, setAvCurr] = useState(["USD"]);
  const [currency, setCurrency] = useState("USD");
  const [status, setStatus] = useState("pending");
  const [rates, setRates] = useState({});
  const [exchangeDate, setExchangeDate] = useState("--");

  function getExchangeRates() {
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
  }

  function getRatesToDisplay() {
    if (status === "pending") {
      return <LoadingOutlined />;
    } else {
      return (
        <>
          {Object.keys(rates).map((rate, index) => {
            return (
              <div className="currency" key={index}>
                <div className="currency--name">{rate}</div>
                <div className="currency--value">
                  {Math.round(rates[rate] * 100) / 100}
                </div>
              </div>
            );
          })}
        </>
      );
    }
  }

  const handleCurrChange = curr => {
    setCurrency(curr);
  };

  useEffect(() => {
    getExchangeRates();
  }, [currency]);

  return (
    <>
      <h3>EXCHANGE RATES</h3>
      <CurrencyPicker options={avCurr} callback={handleCurrChange} />
      <div>AS OF {exchangeDate}</div>
      <div>{getRatesToDisplay()}</div>
    </>
  );
}
