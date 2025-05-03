// store/useGroupStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGroupStore = create(
  persist(
    (set) => ({
      groups: [],
      userGroups: [], // Groups the current user has joined
      addGroup: (newGroup) => 
        set((state) => ({ groups: [...state.groups, newGroup] })),
      joinGroup: (groupId) => 
        set((state) => ({ 
          userGroups: [...state.userGroups, groupId],
          groups: state.groups.filter(g => g.id !== groupId)
        })),
      leaveGroup: (groupId) => 
        set((state) => ({ 
          userGroups: state.userGroups.filter(id => id !== groupId)
        })),
    }),
    {
      name: 'group-storage', // LocalStorage key
    }
  )
);