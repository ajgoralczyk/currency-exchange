
import { Layout, Menu } from 'antd';
import "antd/dist/antd.css";
import './App.css';
import CurrencyRates from "./CurrencyRates.js";
import CurrencyExchange from "./CurrencyExchange.js";
import CurrencyHistory from "./CurrencyHistory.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const { Header, Content } = Layout;

function App() {

  let href=window.location.href.split('/')[3];

  return (
    <Router>
      <Layout>
        <Header>
          <div className="logo">CURRENCY EXCHANGE</div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[`/${href}`]}>
            <Menu.Item key="/">
              <Link to="/">Rates</Link>
            </Menu.Item>
            <Menu.Item key="/exchange">
              <Link to="/exchange">Exchange</Link>
            </Menu.Item>
            <Menu.Item key="/history">
              <Link to="/history">History</Link>
            </Menu.Item>
          </Menu>
        </Header>

        <div className="page-wrapper">
          <Switch>
            <Route path="/exchange">
              <CurrencyExchange />
            </Route>
            <Route path="/history">
              <CurrencyHistory />
            </Route>
            <Route path="/">
              <CurrencyRates />
            </Route>
          </Switch>
        </div>
      </Layout>
    </Router>
  );
}

export default App;
