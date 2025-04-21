import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, List, Typography, Divider, Statistic, Grid, message, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { auth, database } from '../database/firebaseConfig';
import { ref, onValue, push } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import AddExpenseModal from '../components/AddExpenseModal';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const Budget = () => {
  const { userId, budgetId } = useParams();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [user, setUser] = useState(null);

  // Handle authentication state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) navigate('/');
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  // Fetch budget and expenses data
  useEffect(() => {
    if (user && budgetId) {
      const budgetRef = ref(database, `users/${user.uid}/budgets/${budgetId}`);
      const unsubscribeBudget = onValue(budgetRef, (snapshot) => {
        setBudget(snapshot.val());
      });

      const expensesRef = ref(database, `users/${user.uid}/budgets/${budgetId}/expenses`);
      const unsubscribeExpenses = onValue(expensesRef, (snapshot) => {
        const data = snapshot.val();
        const expensesArray = data ? 
          Object.keys(data).map(key => ({
            id: key,
            ...data[key],
            amount: data[key].amount // Keep negative values
          })).sort((a, b) => b.createdAt - a.createdAt) 
          : [];
        setExpenses(expensesArray);
      });

      return () => {
        unsubscribeBudget();
        unsubscribeExpenses();
      };
    }
  }, [user, budgetId]);

  // Calculate financial totals
  const totalIncome = budget?.amount || 0;
  const totalExpenses = Math.abs(expenses.reduce((sum, expense) => sum + expense.amount, 0));
  const remainingBalance = totalIncome - totalExpenses;

  return (
    <div style={{ 
        maxWidth: 800, 
        margin: '0 auto', 
        padding: screens.xs ? '16px' : '24px',
        minHeight: '100vh'
      }}>
        <AddExpenseModal
          visible={showAddExpense}
          onCancel={() => setShowAddExpense(false)}
          onSuccess={(newExpense) => {
            push(ref(database, `users/${user.uid}/budgets/${budgetId}/expenses`), {
              ...newExpense,
              amount: -Math.abs(newExpense.amount),
              createdAt: Date.now()
            });
            message.success('Expense added successfully!');
          }}
        />
      
        {/* Header Section */}
<div style={{ 
  display: 'flex', 
  flexDirection: screens.xs ? 'column' : 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 24,
  marginBottom: 32,
  padding: screens.xs ? 16 : 24,
  backgroundColor: '#ffffff',
  borderRadius: 16,
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
}}>
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: screens.xs ? 'center' : 'flex-start',
    gap: 12,
    width: screens.xs ? '100%' : 'auto'
  }}>
    {/* Title Only - Enhanced Design */}
<div style={{
  padding: screens.xs ? '12px 0' : '16px 0',
  marginBottom: screens.xs ? '8px' : '16px',
  borderBottom: '2px solid #f3f4f6',
  position: 'relative'
}}>
  <Title 
    level={2}
    style={{
      margin: 0,
      fontSize: screens.xs ? '24px' : '32px',
      color: '#111827',
      fontWeight: 700,
      letterSpacing: '-0.75px',
      lineHeight: 1.2,
      paddingLeft: '16px',
      borderLeft: '4px solid #3b82f6',
      display: 'inline-block'
    }}
  >
    {budget?.title || 'My Budget'}
  </Title>
  
  {/* Optional subtle decoration */}
  <div style={{
    position: 'absolute',
    bottom: '-2px',
    left: 0,
    width: '100px',
    height: '2px',
    background: 'linear-gradient(90deg, #3b82f6 0%, rgba(59, 130, 246, 0) 100%)'
  }} />
</div>

    {/* Type */}
    <div>
      <Tag color={budget?.type === 'personal' ? 'blue' : 'purple'}>
        {budget?.type ? budget.type.charAt(0).toUpperCase() + budget.type.slice(1) : 'Type'}
      </Tag>
    </div>

    {/* Add Expense Button */}
    <Button 
      type="primary" 
      icon={<PlusOutlined />}
      onClick={() => setShowAddExpense(true)}
      style={{ 
        width: screens.xs ? '100%' : 'auto',
        height: 48,
        borderRadius: 12,
        fontSize: screens.xs ? 14 : 16,
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(24, 144, 255, 0.25)'
      }}
    >
      Add Expense
    </Button>
  </div>
          
          <div style={{ 
            display: 'flex',
            flexDirection: screens.xs ? 'column' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: screens.xs ? 24 : 48,
            width: '100%',
            textAlign: 'center'
          }}>
            <div>
              <Statistic
                title={<span style={{ color: '#6b7280', fontSize: screens.xs ? 12 : 14 }}>Total Income</span>}
                value={totalIncome}
                precision={2}
                valueStyle={{
                  color: '#16a34a',
                  fontSize: screens.xs ? 20 : 28,
                  fontWeight: 600,
                  letterSpacing: '-0.5px'
                }}
                prefix="₱"
              />
            </div>
            <div>
              <Statistic
                title={<span style={{ color: '#6b7280', fontSize: screens.xs ? 12 : 14 }}>Total Expenses</span>}
                value={totalExpenses}
                precision={2}
                valueStyle={{
                  color: '#dc2626',
                  fontSize: screens.xs ? 20 : 28,
                  fontWeight: 600,
                  letterSpacing: '-0.5px'
                }}
                prefix="₱"
              />
            </div>
            <div>
              <Statistic
                title={<span style={{ color: '#6b7280', fontSize: screens.xs ? 12 : 14 }}>Remaining Balance</span>}
                value={remainingBalance}
                precision={2}
                valueStyle={{
                  color: remainingBalance >= 0 ? '#16a34a' : '#dc2626',
                  fontSize: screens.xs ? 20 : 28,
                  fontWeight: 600,
                  letterSpacing: '-0.5px'
                }}
                prefix="₱"
              />
            </div>
          </div>
        </div>
      
        <Divider style={{ 
          borderColor: '#e5e7eb',
          fontSize: screens.xs ? 14 : 16,
          color: '#374151',
          margin: '32px 0',
          fontWeight: 500
        }}>
          Expenses Breakdown
        </Divider>
      
        <List
          dataSource={expenses}
          renderItem={(expense) => (
            <List.Item style={{ padding: '8px 0' }}>
              <Card 
                style={{ 
                  width: '100%',
                  border: 'none',
                  borderLeft: `4px solid ${expense.amount < 0 ? '#ff4d4f' : '#52c41a'}`,
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
                styles={{
                  body: { padding: '16px 24px' }
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  flexDirection: screens.xs ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: screens.xs ? 'flex-start' : 'center',
                  gap: 12
                }}>
                  {/* Expense Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: screens.xs ? 14 : 16,
                      fontWeight: 500,
                      color: '#1f2937',
                      marginBottom: 4
                    }}>
                      {expense.description}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: 8,
                      alignItems: 'center',
                      color: '#6b7280',
                      fontSize: screens.xs ? 12 : 14
                    }}>
                      <span>{expense.category}</span>
                      <span>•</span>
                      <span>{new Date(expense.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div style={{ 
                    color: expense.amount < 0 ? '#dc2626' : '#16a34a',
                    fontSize: screens.xs ? 14 : 16,
                    fontWeight: 600,
                    minWidth: 100,
                    textAlign: screens.xs ? 'left' : 'right'
                  }}>
                    ₱{Math.abs(expense.amount).toLocaleString()}
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
  );
};

export default Budget;