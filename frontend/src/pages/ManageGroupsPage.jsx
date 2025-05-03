import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ManageGroupsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/groups/${id}`)
      .then(res => {
        console.log("Group data:", res.data);
        setGroup(res.data);
      })
      .catch(err => {
        console.error("Error fetching group:", err);
        navigate('/groups');
      });
  }, [id, navigate]);

  const handleRemove = async (userId) => {
    try {
      await axios.post(`http://localhost:8080/api/groups/${id}/remove`, { userId });
      setGroup(prev => ({
        ...prev,
        members: prev.members.filter(m => m.userId._id !== userId)
      }));
    } catch (err) {
      console.error("Error removing user:", err);
    }
  };

  const handlePromote = async (userId) => {
    try {
      await axios.post(`http://localhost:8080/api/groups/${id}/promote`, { userId });
      setGroup(prev => ({
        ...prev,
        members: prev.members.map(m => 
          m.userId._id === userId ? { ...m, isAdmin: true } : m
        )
      }));
    } catch (err) {
      console.error("Error promoting user:", err);
    }
  };

  if (!group) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Group: {group.name}</h2>
      <p className="mb-4">{group.subject}</p>
      
      <h3 className="text-xl font-medium mb-2">Members</h3>
      <ul className="space-y-2">
        {group.members.map(member => (
          <li key={member.userId._id} className="p-3 bg-white shadow rounded-lg flex justify-between items-center">
            <div>
              <span className="font-medium">{member.userId.fullname}</span>
              {member.isAdmin && <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Admin</span>}
            </div>
            <div className="space-x-2">
              {!member.isAdmin && (
                <button 
                  onClick={() => handlePromote(member.userId._id)} 
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                >
                  Promote
                </button>
              )}
              <button 
                onClick={() => handleRemove(member.userId._id)} 
                className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};