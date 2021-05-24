import React, { useContext, useState } from "react";
import { Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BarChartOutlined,
  CloudOutlined,
  TeamOutlined,
  UserOutlined,
  BankOutlined,
} from "@ant-design/icons";
import "../style/styles.css";
import { Link, Redirect } from "react-router-dom";
import OnlineContext from "../context/online.context";
import MainFooter from "../style/MainFooter";
// import test from "../assets/img/logo.jpg"

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const MainLayout = ({ ComponentFromApp }) => {
  let path = window.location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  const { id, name, online } = useContext(OnlineContext);

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };
  const logout = () => {
    localStorage.clear("token");
    window.location.replace("/login");
  };
  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
        }}
      >
        <div
          className="logo"
          style={{
            background:
              "url(https://www.cryptoninjas.net/wp-content/uploads/logos-omaye-cryptoninjas.png)",
          }}
        />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[`${path}`]}>
          <Menu.Item key="/" icon={<BarChartOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/tenants" icon={<TeamOutlined />}>
            <Link to="/tenants">Tenants</Link>
          </Menu.Item>
          <Menu.Item key="/subscriptions" icon={<CloudOutlined />}>
            <Link to="/subscriptions">Subscriptions</Link>
          </Menu.Item>
          <Menu.Item key="/franchises" icon={<BankOutlined />}>
            <Link to={`/franchises`}>Franchises</Link>
          </Menu.Item>
          <SubMenu key="3" icon={<UserOutlined />} title={name}>
            <Menu.Item>
              <Link to={`/user/${id}`}>Account</Link>
            </Menu.Item>

            <Menu.Item onClick={() => logout()}>Logout</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout
        className="site-layout"
        style={collapsed ? { marginLeft: "100px" } : { marginLeft: "210px" }}
      >
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => toggleCollapse(),
            }
          )}
          NexumBytes
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {online ? <ComponentFromApp /> : <Redirect to="/login" />}

          <Footer />
        </Content>
        <MainFooter />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
