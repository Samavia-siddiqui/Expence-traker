import API from './axiosInstance.js';

// Add a new expense
export const addExpense = async (expenseData) => {
  const response = await API.post('/expenses', expenseData);
  return response.data;
};

// Get all expenses for a specific group
export const getGroupExpenses = async (groupId) => {
  const response = await API.get(`/expenses/group/${groupId}`);
  return response.data;
};

// Get balance and spend summary for a group
export const getGroupBalances = async (groupId) => {
  const response = await API.get(`/expenses/group/${groupId}/balances`);
  return response.data;
};

// Delete an expense
export const deleteExpense = async (expenseId) => {
  const response = await API.delete(`/expenses/${expenseId}`);
  return response.data;
};
