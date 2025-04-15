import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button } from 'antd';

const { Option } = Select;

const AddExpenseModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await onSuccess({
        ...values,
        amount: values.amount
      });
      form.resetFields();
      onCancel();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Expense"
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
          Add Expense
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: 'Please input the amount!' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={1}
            precision={2}
            placeholder="0.00"
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input a description!' }]}
        >
          <Input placeholder="e.g. Groceries" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: 'Please select a category!' }]}
        >
          <Select placeholder="Select category">
            <Option value="Food">Food</Option>
            <Option value="Transportation">Transportation</Option>
            <Option value="Utilities">Utilities</Option>
            <Option value="Entertainment">Entertainment</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddExpenseModal;