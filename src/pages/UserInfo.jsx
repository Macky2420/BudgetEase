import React, { useEffect, useState } from 'react';
import { Card, Button, message, Modal, Form, Input } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { getDatabase, ref, get } from 'firebase/database';
import { useParams } from 'react-router-dom';
import { getAuth, updatePassword } from 'firebase/auth';

const UserInfo = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);

    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setUser(snapshot.val());
        } else {
          message.error('User not found!');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        message.error('Failed to fetch user data!');
        setLoading(false);
      });
  }, [userId]);

  const handleChangePassword = async (values) => {
    const { newPassword } = values;
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    if (currentUser) {
      try {
        await updatePassword(currentUser, newPassword);
        message.success('Password updated successfully!');
  
        // Log out the user
        await auth.signOut();
  
        // Redirect to login or home
        window.location.href = '/'; // change to your login route if needed
      } catch (error) {
        message.error(error.message);
      }
    } else {
      message.error('User not authenticated.');
    }
  };
  

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white px-4 py-12 flex justify-center">
      <Card
        style={{
          width: '100%',
          maxWidth: 380,
          borderRadius: 20,
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
        }}
        styles={{
          body: { padding: '32px 28px' },
        }}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-blue-100">
            <UserOutlined style={{ fontSize: 32, color: '#1890ff' }} />
          </div>
          <h2 className="text-2xl sm:text-xl font-semibold text-gray-800 mt-4">
            {user?.fullName}
          </h2>
          <p className="text-gray-500 text-sm sm:text-xs mt-1">{user?.job}</p>
        </div>

        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm sm:text-xs">
            <MailOutlined />
            <span>{user?.email}</span>
          </div>
        </div>

        <Button
          type="primary"
          danger
          icon={<LockOutlined />}
          block
          size="large"
          style={{ borderRadius: 8 }}
          onClick={() => setShowPasswordModal(true)}
        >
          Forgot Password
        </Button>
      </Card>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={showPasswordModal}
        onCancel={() => setShowPasswordModal(false)}
        footer={null}
        centered
      >
        <Form layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserInfo;
