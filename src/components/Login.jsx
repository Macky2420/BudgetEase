import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const Login = ({showLogin, setShowLogin}) => {
  
    const handleCloseLogin = () => {
        setShowLogin(false);
    }

  return (
    <Modal
      title="Login Now"
      open={showLogin}
      footer={null}
      onCancel={handleCloseLogin}
      centered
    >
      <Form
        layout="vertical"
        onFinish=""
        className="w-full"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Log In
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Login;
