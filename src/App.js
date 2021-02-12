import './App.css';
import "antd/dist/antd.css";
import CurrencyRates from "./CurrencyRates.js";
import CurrencyExchange from "./CurrencyExchange.js";
import CurrencyHistory from "./CurrencyHistory.js";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        CURRENCY EXCHANGE
      </header>
      <div>
        <CurrencyRates />
        <hr />
        <CurrencyExchange />
        <hr />
        <CurrencyHistory />
        <br />
        <br />
      </div>
    </div>
  );
}

export default App;
