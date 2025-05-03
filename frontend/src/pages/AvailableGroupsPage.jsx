import { useEffect, useState } from 'react';
import { authStore } from '../store/useAuthStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AvailableGroupsPage = () => {
  const { authUser } = authStore();
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser?._id) return;

    axios.get(`http://localhost:8080/api/groups/available/${authUser._id}`)
      .then(res => {
        console.log("Available groups:", res.data);
        setGroups(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Fetch failed:", err);
        setGroups([]);
      });
  }, [authUser?._id]);

  const handleJoin = async (groupId) => {
    try {
      await axios.post(`http://localhost:8080/api/groups/${groupId}/join`, { userId: authUser._id });
      setGroups(prev => prev.filter(g => g._id !== groupId));
    } catch (err) {
      console.error("Join group error:", err);
    }
  };

  const handleCreateGroup = () => {
    navigate('/groups/create'); // Redirect to Create Group page
  };

  if (!authUser) return <div>Loading user info...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Available Groups</h2>

      {groups.length > 0 ? (
        <ul className="space-y-4">
          {groups.map(group => (
            <li key={group._id} className="p-4 bg-white shadow rounded flex justify-between items-center">
              <span>{group.name} - {group.subject}</span>
              <button 
                onClick={() => handleJoin(group._id)} 
                className="text-green-500 hover:text-green-700"
              >
                ➕ Join
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center">
          <p className="text-xl text-gray-500">😔 No groups available? Create your own!</p>
          <button
            onClick={handleCreateGroup}
            className="bg-blue-500 text-white p-2 rounded mt-4"
          >
            Create a Group
          </button>
        </div>
      )}
    </div>
  );
};
