import { useEffect, useState } from 'react';
import { authStore } from '../store/useAuthStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const GroupsPage = () => {
  const { authUser } = authStore();
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate(); // Hook to navigate to different pages

  useEffect(() => {
    if (!authUser?._id) return;

    axios.get(`http://localhost:8080/api/groups/user/${authUser._id}`)
      .then(res => {
        console.log("Fetched groups:", res.data);
        setGroups(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Fetch failed:", err);
        setGroups([]);
      });
  }, [authUser?._id]);

  const handleLeave = async (groupId) => {
    try {
      await axios.post(`http://localhost:8080/api/groups/${groupId}/leave`, { userId: authUser._id });
      setGroups(prev => prev.filter(g => g._id !== groupId));
    } catch (err) {
      console.error("Leave group error:", err);
    }
  };

  const handleManageGroup = (groupId) => {
    navigate(`/groups/manage/${groupId}`); // Redirect to Manage Group page with groupId
  };

  const handleCreateGroup = () => {
    navigate('/groups/create'); // Redirect to Create Group page
  };

  const handleAvailableGroups = () => {
    navigate('/groups/available'); // Redirect to Available Groups page
  };

  if (!authUser) return <div>Loading user info...</div>;

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={handleCreateGroup}
          className="bg-blue-500 text-white p-2 rounded mr-4"
        >
          Create Group
        </button>
        <button
          onClick={handleAvailableGroups}
          className="bg-green-500 text-white p-2 rounded"
        >
          Available Groups
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
      {Array.isArray(groups) && groups.length > 0 ? (
        <ul className="space-y-4">
          {groups.map(group => (
            <li key={group._id} className="p-4 bg-white shadow rounded flex justify-between items-center">
              <span>{group.name} ({group.subject})</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleManageGroup(group._id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Manage Group
                </button>
                <button 
                  onClick={() => handleLeave(group._id)} 
                  className="text-red-500 hover:text-red-700"
                >
                  Leave
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No groups joined yet.</p>
      )}
    </div>
  );
};
