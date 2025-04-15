import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { List, Avatar, Button, Dropdown, Menu, Typography, Grid, message, Modal, Form, Input } from 'antd';
import { DollarOutlined, WalletOutlined, EllipsisOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddBudgetModal from '../components/addBudgetModal';
import { auth, database } from '../database/firebaseConfig';
import { ref, onValue, remove, update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const Home = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const [budgets, setBudgets] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);

  // Authentication state listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) navigate('/');
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  // Fetch budgets from Firebase
  useEffect(() => {
    if (user) {
      const budgetsRef = ref(database, `users/${user.uid}/budgets`);
      const unsubscribe = onValue(budgetsRef, (snapshot) => {
        const data = snapshot.val();
        const budgetsArray = data ? Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })) : [];

        const sortedBudgets = budgetsArray.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        setBudgets(sortedBudgets);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleMenuClick = async (id, action, e) => {
    e.domEvent.stopPropagation();

    if (action === 'edit') {
      const selectedBudget = budgets.find(b => b.id === id);
      setEditingBudget(selectedBudget);
      setEditModalVisible(true);
    } else if (action === 'delete') {
      try {
        await remove(ref(database, `users/${user.uid}/budgets/${id}`));
        message.success('Budget deleted successfully');
      } catch (error) {
        message.error('Error deleting budget: ' + error.message);
      }
    }
  };

  const menuItems = (id) => [
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: (e) => handleMenuClick(id, 'edit', e)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (e) => handleMenuClick(id, 'delete', e)
    }
  ];

  const getIcon = (type) => {
    const iconProps = { style: { fontSize: screens.xs ? 16 : 20 } };
    switch (type) {
      case 'income': return <DollarOutlined {...iconProps} style={{ ...iconProps.style, color: '#52c41a' }} />;
      case 'expense': return <WalletOutlined {...iconProps} style={{ ...iconProps.style, color: '#ff4d4f' }} />;
      default: return <WalletOutlined {...iconProps} style={{ ...iconProps.style, color: '#1890ff' }} />;
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      const budgetRef = ref(database, `users/${user.uid}/budgets/${editingBudget.id}`);
      await update(budgetRef, { title: values.title });
      message.success('Budget updated successfully!');
      setEditModalVisible(false);
    } catch (error) {
      message.error('Error updating budget: ' + error.message);
    }
  };

  return (
    <div style={{
      maxWidth: 800,
      margin: '0 auto',
      padding: screens.xs ? '0 16px' : '0 24px'
    }}>
      {/* Add Budget Modal */}
      <AddBudgetModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => message.success('Budget created successfully!')}
      />

      {/* Edit Budget Modal */}
      <Modal
        title="Edit Budget Title"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
        okText="Update"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
          initialValues={{ title: editingBudget?.title }}
          preserve={false}
        >
          <Form.Item
            name="title"
            label="New Title"
            rules={[{ required: true, message: 'Please input a new title' }]}
          >
            <Input placeholder="Enter new budget title" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: screens.xs ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: screens.xs ? 'flex-start' : 'center',
        marginBottom: 24,
        gap: screens.xs ? 16 : 0
      }}>
        <Text strong style={{ fontSize: screens.xs ? 18 : 20 }}>Your Budgets</Text>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size={screens.xs ? 'small' : 'middle'}
          onClick={() => setIsModalVisible(true)}
        >
          {screens.xs ? 'New' : 'Add New Budget'}
        </Button>
      </div>

      {/* List */}
      <List
        itemLayout="horizontal"
        dataSource={budgets}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Dropdown
                menu={{ items: menuItems(item.id) }}
                trigger={['click']}
                placement="bottomRight"
                overlayStyle={{ minWidth: 120 }}
                key="actions"
              >
                <Button
                  type="text"
                  icon={<EllipsisOutlined style={{ fontSize: screens.xs ? 16 : 18 }} />}
                  size={screens.xs ? 'small' : 'middle'}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                />
              </Dropdown>
            ]}
            style={{
              cursor: 'pointer',
              padding: screens.xs ? '12px 16px' : '16px 24px',
              marginBottom: 8,
              backgroundColor: '#fff',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.3s'
            }}
            onClick={() => navigate(`/home/${userId}/${item.id}`)}
          >
            <List.Item.Meta
              avatar={<Avatar
                icon={getIcon(item.type)}
                size={screens.xs ? 'default' : 'large'}
              />}
              title={<Text strong style={{ fontSize: screens.xs ? 14 : 16 }}>
                {item.title}
              </Text>}
              description={<Text style={{ fontSize: screens.xs ? 12 : 14 }}>
                ₱ {item.amount?.toLocaleString()}
              </Text>}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Home;
