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
  const [ammount, setAmmount] = useState(1);
  const [rate, setRate] = useState(1);
  const [rates, setRates] = useState(1);

  const [status, setStatus] = useState("pending");
  const [exchangeDate, setExchangeDate] = useState("--");

  useEffect(() => {
    axios.get(`https://api.exchangeratesapi.io/latest`).then(res => {
      setAvCurr(Object.keys(res?.data?.rates ?? {}));
    });
  }, []);

  function getExchangeRates() {
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
  }
  // https://api.exchangeratesapi.io/latest?base=USD&symbols=GBP
  // {"rates":{"USD":1.2147,"GBP":0.87755},"base":"EUR","date":"2021-02-11"}

  const handleFromChange = curr => {
    setFromCurrency(curr);
  };

  const handleToChange = curr => {
    setToCurrency(curr);
  };

  const handleAmmountChange = event => {
    setAmmount(event.target.value);
    console.log(event.target.value);
  };

  useEffect(() => {
    getExchangeRates();
  }, [fromCurrency, toCurrency]);

  return (
    <>
      <h3>CURRENCY EXCHANGE</h3>
      <div className="exchange-setup">
        <input onChange={handleAmmountChange} value={ammount} />
        <CurrencyPicker options={avCurr} callback={handleFromChange} />
        <CurrencyPicker options={avCurr} callback={handleToChange} />
      </div>
      <div>AS OF {exchangeDate}</div>

      <div>RESULT {Math.round(rate * ammount * 100) / 100}</div>
      <div>Other Currencies:</div>
      {Object.keys(rates).map((rate, index) => {
        return (
          <div key={index}>
            {rate} {Math.round(ammount * rates[rate] * 100) / 100}
          </div>
        );
      })}
    </>
  );
}
