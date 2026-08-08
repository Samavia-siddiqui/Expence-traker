import API from './axiosInstance.js';

// Fetch all groups the user belongs to
export const getGroups = async () => {
  const response = await API.get('/groups');
  return response.data;
};

// Create a new group
export const createGroup = async (groupData) => {
  const response = await API.post('/groups', groupData);
  return response.data;
};

// Get details of a specific group
export const getGroupById = async (groupId) => {
  const response = await API.get(`/groups/${groupId}`);
  return response.data;
};

// Join an existing group using a join code
export const joinGroup = async (joinCode) => {
  const response = await API.post('/groups/join', { joinCode });
  return response.data;
};

// Add a member directly by their email address
export const addGroupMember = async (groupId, email) => {
  const response = await API.post(`/groups/${groupId}/members`, { email });
  return response.data;
};
