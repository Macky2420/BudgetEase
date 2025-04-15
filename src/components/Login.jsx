import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Ensure your Firebase app is initialized in another file, e.g. firebase.js

const Login = ({ showLogin, setShowLogin }) => {
  
  const navigate = useNavigate(); // React Router's hook for navigation
  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const onFinish = async (values) => {
    const { email, password } = values;
    const auth = getAuth(); // Gets the default FirebaseAuth instance

    try {
      // Attempt to sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user ID after successful login
      const userId = userCredential.user.uid;
      
      // Navigate to the /home/:userId route
      navigate(`/home/${userId}`);
      
      message.success('Logged in successfully!');
      setShowLogin(false);
    } catch (error) {
      // Display an error message if the login fails
      message.error(error.message);
    }
  };

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
        onFinish={onFinish}
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
          rules={[
            { required: true, message: 'Please input your password!' }
          ]}
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
