import React, { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Switch, Avatar, Button } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  BarChartOutlined,
  BookOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 450);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
      setIsMobile(window.innerWidth < 450);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userMenu = (
    <Menu>
      <Menu.Item key="/dashboard/profile" icon={<UserOutlined />}>
        <Link to="/dashboard/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => {
          localStorage.clear();
          navigate("/start-your-journey");
        }}
      >
        Logout
      </Menu.Item>

    </Menu>
  );

  const mobileMenu = (
    <Menu>
      <Menu.Item key="/dashboard/home" icon={<HomeOutlined />}>
        <Link to="/dashboard/home">Home</Link>
      </Menu.Item>
      <Menu.Item key="/dashboard/profile" icon={<UserOutlined />}>
        <Link to="/dashboard/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="/dashboard/score-analytics" icon={<BarChartOutlined />}>
        <Link to="/dashboard/score-analytics">Score Analytics</Link>
      </Menu.Item>
      <Menu.Item key="/dashboard/resources" icon={<BookOutlined />}>
        <Link to="/dashboard/resources">Resources</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className={`dashboard-layout ${darkMode ? "dark-theme" : "light-theme"}`}>
      {!isMobile && (
        <Sider collapsed={collapsed} theme={darkMode ? "dark" : "light"} className="custom-sidebar">
          <div className="logo">{collapsed ? "PX" : "PrepXpert"}</div>
          <Menu theme={darkMode ? "dark" : "light"} mode="inline" selectedKeys={[location.pathname]}>
            <Menu.Item key="/dashboard/home" icon={<HomeOutlined />}>
              <Link to="/dashboard/home">Home</Link>
            </Menu.Item>
            <Menu.Item key="/dashboard/profile" icon={<UserOutlined />}>
              <Link to="/dashboard/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item key="/dashboard/score-analytics" icon={<BarChartOutlined />}>
              <Link to="/dashboard/score-analytics">Score Analytics</Link>
            </Menu.Item>
            <Menu.Item key="/dashboard/resources" icon={<BookOutlined />}>
              <Link to="/dashboard/resources">Resources</Link>
            </Menu.Item>
          </Menu>
        </Sider>
      )}

      <Layout>
        <Header className="dashboard-header">
          <div className="header-left">
            {isMobile ? (
              <Dropdown overlay={mobileMenu} trigger={["click"]} placement="bottomLeft">
                <Button type="text" icon={<MenuOutlined />} className="toggle-button" style={{ color: "#6372ff" }} />
              </Dropdown>
            ) : (
              <Button
                style={{ color: "#6372ff" }}
                id="nav-closer"
                type="text"
                icon={<MenuUnfoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="toggle-button"
              />
            )}
            <Switch
              style={{ paddingTop: "5px", backgroundColor: "#6372ff" }}
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              checkedChildren={<SunOutlined />}
              unCheckedChildren={<MoonOutlined />}
            />
          </div>

          <Dropdown overlay={userMenu} placement="bottomRight" trigger={["click"]}>
            <Avatar style={{ backgroundColor: "#6372ff" }} className="user-avatar" icon={<UserOutlined />} />
          </Dropdown>
        </Header>

        <Content className="dashboard-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
