import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Avatar, Dropdown, Menu, Modal, Input, message, Button } from "antd";
import { UserOutlined, SettingOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Profile.css"; 
const { Title, Text } = Typography;
const { confirm } = Modal;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/"); 
    }
  }, [navigate]);

  if (!user) return null;

  const handleEditClick = () => {
    setEditedUser({ name: user.name, email: user.email, password: "" }); 
    setIsModalOpen(true);
    if (user.name === "guest") {
      message.warning("This action is not permitted for the guest user.");
    }
  };

  const handleChange = (e) => {
    if (user.name === "guest") return; 
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
    if (name === "password" && value.length > 0 && value.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
    } else {
      setPasswordError("");
    }
  };

  const handleSave = async () => {
    if (user.name === "guest") return; 
    if (passwordError) {
      message.error("Please enter a valid password.");
      return;
    }
    try {
      const response = await fetch(`https://prep-backend.onrender.com/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, 
        },
        body: JSON.stringify(editedUser),
      });      

      if (!response.ok) throw new Error("Failed to update user");

      const updatedUser = { ...user, ...editedUser };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsModalOpen(false);
      message.success("Profile updated successfully!");
    } catch (error) {
      message.error("Error updating profile!");
    }
  };

  const handleDeleteAccount = async () => {
    confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleOutlined />, 
      content: user.name === "guest" 
        ? "This action is not permitted for the guest user."
        : "This action will permanently delete your account.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: { disabled: user.name === "guest" },
      async onOk() {
        if (user.name !== "guest") {
          try {
            await fetch(`https://prep-backend.onrender.com/api/users/${user.id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
              }
            });
            localStorage.removeItem("user");
            message.success("Account deleted successfully!");
            navigate("/");
          } catch {
            message.error("Error deleting account!");
          }
        }
      },
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="edit" onClick={handleEditClick}>Edit Details</Menu.Item>
      <Menu.Item key="delete" onClick={handleDeleteAccount} danger>Delete Account</Menu.Item>
    </Menu>
  );

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <Dropdown overlay={menu} trigger={["hover"]} placement="bottomRight">
          <SettingOutlined className="settings-icon" />
        </Dropdown>

        <Avatar size={80} icon={<UserOutlined />} className="profile-avatar" />

        <Title level={3} className="profile-name">{user.name}</Title>

        <Row gutter={[16, 16]} className="profile-details">
          <Col span={24}>
            <Text className="pt" strong>Email:</Text>
            <Text className="profile-text">{user.email}</Text>
          </Col>
          <Col span={24}>
            <Text className="pt" strong>Communication Score:</Text>
            <Text className="profile-text">{user.communication_score}</Text>
          </Col>
          <Col span={24}>
            <Text className="pt" strong>Aptitude Score:</Text>
            <Text className="profile-text">{user.aptitude_score}</Text>
          </Col>
          <Col span={24}>
            <Text className="pt" strong>Technical Score:</Text>
            <Text className="profile-text">{user.technical_score}</Text>
          </Col>
          <Col span={24}>
            <Text className="pt" strong>Overall Score:</Text>
            <Text className="profile-overall-score">{user.overall_score}</Text>
          </Col>
        </Row>
      </Card>

      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
      >
        <Input
          name="name"
          placeholder="Enter your name"
          value={editedUser.name}
          onChange={handleChange}
          className="modal-input"
          disabled={user.name === "guest"}
        />
        <Input
          name="email"
          placeholder="Enter your email"
          value={editedUser.email}
          onChange={handleChange}
          className="modal-input"
          style={{ marginTop: "10px" }}
          disabled={user.name === "guest"}
        />
        <Input.Password
          name="password"
          placeholder="Enter new password"
          value={editedUser.password}
          onChange={handleChange}
          className="modal-input"
          style={{ marginTop: "10px" }}
          disabled={user.name === "guest"}
        />
        {passwordError && <Text type="danger">{passwordError}</Text>}
      </Modal>
    </div>
  );
};

export default Profile;
