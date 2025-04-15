import React, {useState} from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { registerUser } from '../utils/registerUser';
import { useNavigate } from 'react-router-dom';

const Register = ({ showRegister, setShowRegister }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleCloseRegister = () => {
    setShowRegister(false);
    form.resetFields();
  };

  const handleRegister = async (values) => {
    setIsSubmitting(true);  // Start loading
    try {
      const result = await registerUser(values);
      
      if (result.success) {
        const uid = result.user.uid;
        message.success('Registration successful!');
        handleCloseRegister();
        navigate(`/home/${uid}`);
      } else {
        message.error(result.error);
      }
    } finally {
      setIsSubmitting(false);  // Stop loading in all cases
    }
  };


  return (
    <Modal
      title="Register Now"
      open={showRegister}
      footer={null}
      onCancel={handleCloseRegister}
      centered
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleRegister}
        className="w-full"
      >
        {/* Form items remain unchanged */}
        <Form.Item
          label="Full Name"
          name="fullname"
          rules={[
            { required: true, message: 'Please input your full name!' },
            { min: 6, message: 'Full name must be at least 6 characters.' },
          ]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        <Form.Item
          label="Job"
          name="job"
          rules={[
            { required: true, message: 'Please input your job!' },
            { min: 6, message: 'Job must be at least 6 characters.' },
          ]}
        >
          <Input placeholder="Enter your job title" />
        </Form.Item>

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
            { required: true, message: 'Please input your password!' },
            { min: 8, message: 'Password must be at least 8 characters.' },
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitting} className="w-full">
            Register
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Register;