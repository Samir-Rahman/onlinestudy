import { useState } from 'react';
import { authStore } from '../store/useAuthStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const CreateGroupPage = () => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const { authUser } = authStore();
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name || !subject || !timeSlot) return alert("Please fill all fields.");

    try {
      await axios.post('http://localhost:8080/api/groups/create', {
        name,
        subject,
        timeSlot,
        createdBy: authUser._id
      });
      navigate('/groups');
    } catch (err) {
      console.error("Create group error:", err);
      alert("Failed to create group.");
    }
  };

  if (!authUser) return <div>Loading user info...</div>;

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Create a New Group</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Group Name" className="w-full p-2 border rounded" />
      <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject/Topic" className="w-full p-2 border rounded" />
      <input value={timeSlot} onChange={e => setTimeSlot(e.target.value)} placeholder="Preferred Time Slot" className="w-full p-2 border rounded" />
      <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded">Create Group</button>
    </div>
  );
};

