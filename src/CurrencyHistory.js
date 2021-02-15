import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./App.css";
import axios from "axios";
import CurrencyPicker from "./CurrencyPicker.js";
import { LoadingOutlined } from "@ant-design/icons";
import { Table, Typography, Row, Col, Space, Statistic } from "antd";

export default function CurrencyRates() {
  const today = new Date().toISOString().substr(0,10);
  const [avCurr, setAvCurr] = useState(["USD"]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("USD");
  const [history, setHistory] = useState();
  const [rate, setRate] = useState(1);

  const [status, setStatus] = useState("pending");
  const [exchangeDate, setExchangeDate] = useState("--");

  useEffect(() => {
    axios.get(`https://api.exchangeratesapi.io/latest`).then(res => {
      setAvCurr(Object.keys(res?.data?.rates ?? {}));
    });
  }, []);

  new Date().toString();

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
        `https://api.exchangeratesapi.io/history?start_at=2019-01-01&end_at=${today}&base=${fromCurrency}&symbols=${toCurrency}`
      )
      .then(res => {
        let data = res?.data;

        let newestDate = Object.keys(data?.rates).reduce((max, val) => max > val ? max : val)
        setExchangeDate(newestDate ?? "--");
        setRate(data?.rates[newestDate][toCurrency] ?? 1);
        setHistory(data?.rates ?? 1);
        setStatus("done");
      });
  }, [fromCurrency, toCurrency, today]);

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
        <>
          <Typography.Text>Past</Typography.Text>
          <Table dataSource={data} columns={columns} bordered={true} pagination={false}/>
        </>
      );
    }
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <Space size={20}>
            <CurrencyPicker options={avCurr} callback={handleFromChange} />
            <CurrencyPicker options={avCurr} callback={handleToChange} />
          </Space>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Statistic title="Current exchange rate" value={rate.toFixed(4)} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Typography.Text strong className="overview__date">As of: {exchangeDate}</Typography.Text>
        </Col>
      </Row>
      {getRatesToDisplay()}
    </>
  );
}
