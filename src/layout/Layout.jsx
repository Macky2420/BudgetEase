import React, { useEffect, useState } from 'react';
import { useOutlet, useNavigate } from 'react-router-dom';
import { Layout, Button, Spin, Dropdown, message } from 'antd';
import { MenuOutlined, HomeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { auth } from '../database/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const { Header, Content, Footer } = Layout;

const AppLayout = () => {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        navigate('/');
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleMenuClick = (key) => {
    switch (key) {
      case 'home':
        navigate(`/home/${user?.uid}`);
        break;
      case 'user-info':
        navigate(`/userInfo/${user?.uid}`);
        break;
      case 'logout':
        signOut(auth).then(() => {
          message.success('Logged out successfully');
          navigate('/');
        }).catch(error => {
          message.error('Logout failed: ' + error.message);
        });
        break;
      default:
        break;
    }
  };

  const menuItems = [
    { key: 'home', label: 'Home', icon: <HomeOutlined /> },
    { key: 'user-info', label: 'User Info', icon: <UserOutlined /> },
    { type: 'divider' },
    { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true }
  ];

  const menuProps = {
    items: menuItems,
    onClick: ({ key }) => handleMenuClick(key),
    style: {
      minWidth: '160px',
      borderRadius: '8px',
      padding: '8px 0'
    },
  };

  if (!authChecked) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100vh'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#ffffff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          background: 'linear-gradient(45deg, #1890ff, #722ed1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          BudgetEase
        </div>

        <Dropdown menu={menuProps} trigger={['click']}>
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: '20px' }} />}
            style={{ color: '#595959' }}
          />
        </Dropdown>
      </Header>

      <Content style={{
        padding: '24px',
        backgroundColor: '#f8f9fa',
        flex: '1 0 auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '24px'
        }}>
          {outlet}
        </div>
      </Content>

      <Footer style={{
        textAlign: 'center',
        backgroundColor: '#d1d5db',
        padding: '16px 0'
      }}>
        <p style={{ fontSize: '0.875rem', color: '#1f2937' }}>
          © 2025 - All rights reserved by FRANCIS IVAN BATICAN
        </p>
      </Footer>
    </Layout>
  );
};

export default AppLayout;
