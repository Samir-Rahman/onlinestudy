import { authStore } from '../store/useAuthStore'
import { UserSearch } from '../components/UserSearch'
import { Link } from 'react-router-dom';
export const HomePage = () => {
  const { authUser } = authStore()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Welcome, {authUser?.fullname}!</h1>
      
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold">Find and Rate Users</h2>
        <UserSearch />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Study Groups</h2>
        <p className="text-gray-600">
        <Link 
      to="/groups" 
      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
    >
      Manage Groups
    </Link>
        </p>
      </div>
    </div>
  )
}