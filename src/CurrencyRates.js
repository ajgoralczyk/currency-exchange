import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./App.css";
import axios from "axios";
import CurrencyPicker from "./CurrencyPicker.js";
import { LoadingOutlined } from "@ant-design/icons";
import { Table, Typography, Row, Col } from "antd";


export default function CurrencyRates() {
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
        return {
          Currency: rate, 
          Rate: rates[rate].toFixed(4), 
          key: index
        }
      }).sort((a, b) => {return a['Currency'] < b['Currency'] ? -1 : 1});
      let columns = [
        {title:'Currency', dataIndex:'Currency'}, 
        {title:'Rate', dataIndex:'Rate'}
      ];
      return (
        <>
          <Table columns={columns} dataSource={data} bordered={true} pagination={false}/>
        </>
      );
    }
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <CurrencyPicker options={avCurr} callback={handleCurrChange} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Typography.Text strong className="overview__date">As of: {exchangeDate}</Typography.Text>
        </Col>
      </Row>
      <div>{getRatesToDisplay()}</div>
    </>
  );
}
