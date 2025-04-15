import React, {useState} from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { ref, push } from 'firebase/database';
import { auth, database } from '../database/firebaseConfig';

const { Option } = Select;

const AddBudgetModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const newBudgetRef = push(ref(database, `users/${user.uid}/budgets`), {
        ...values,
        amount: parseFloat(values.amount),
        createdAt: new Date().toISOString()
      });

      onSuccess({
        id: newBudgetRef.key,
        ...values,
        amount: parseFloat(values.amount)
      });
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error('Error creating budget: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create New Budget"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={() => form.submit()}
        >
          Create
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Budget Title"
          name="title"
          rules={[{ required: true, message: 'Please input the budget title!' }]}
        >
          <Input placeholder="e.g. February Income" />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: 'Please input the amount!' }]}
        >
          <Input type="number" prefix="₱" />
        </Form.Item>

        <Form.Item
          label="Budget Type"
          name="type"
          rules={[{ required: true, message: 'Please select a type!' }]}
        >
          <Select placeholder="Select type">
            <Option value="income">Income</Option>
            <Option value="allowance">Allowance</Option>
            <Option value="saving">Saving</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddBudgetModal;