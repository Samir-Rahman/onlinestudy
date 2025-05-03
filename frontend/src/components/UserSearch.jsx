import { useState } from 'react'
import { axiosInstance } from '../lib/axios'
import { UserRating } from './UserRating'

export const UserSearch = () => {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    try {
      const res = await axiosInstance.get(`/auth/users/search?query=${encodeURIComponent(query)}`)
      setUsers(res.data.users)
    } catch (err) {
      setError('Failed to search users')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by name or email..."
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {users.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Search Results</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {users.map((user) => (
              <div
                key={user._id}
                className="p-4 border rounded-lg hover:border-indigo-500 cursor-pointer"
                onClick={() => setSelectedUser(selectedUser?._id === user._id ? null : user)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={user.profilePic || 'https://via.placeholder.com/40'}
                    alt={user.fullname}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{user.fullname}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Rate {selectedUser.fullname}</h3>
          <UserRating userId={selectedUser._id} />
        </div>
      )}
    </div>
  )
}