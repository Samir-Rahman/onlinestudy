import { useState } from 'react'
import { authStore } from '../store/useAuthStore'
import { UserRating } from '../components/UserRating'

export const ProfilePage = () => {
  const { authUser, updateProfile, updateSubjects } = authStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newSubject, setNewSubject] = useState('')

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setLoading(true)
    setError('')

    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        const result = await updateProfile(reader.result)
        if (!result.success) {
          setError(result.error)
        }
      }
    } catch (err) {
      setError('Failed to update profile picture')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSubject = async (e) => {
    e.preventDefault()
    if (!newSubject.trim()) return

    setLoading(true)
    setError('')

    const updatedSubjects = [...(authUser?.subjects || []), newSubject.trim()]
    try {
      const result = await updateSubjects(updatedSubjects)
      if (result.success) {
        setNewSubject('')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to add subject')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSubject = async (subjectToRemove) => {
    setLoading(true)
    setError('')

    const updatedSubjects = authUser?.subjects.filter(subject => subject !== subjectToRemove)
    try {
      const result = await updateSubjects(updatedSubjects)
      if (!result.success) {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to remove subject')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={authUser?.profilePic || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              <label
                className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700"
                htmlFor="profile-pic"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <input
                  type="file"
                  id="profile-pic"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                />
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{authUser?.fullname}</h2>
              <p className="text-gray-600">{authUser?.email}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Subjects of Interest</h3>
            <form onSubmit={handleAddSubject} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Add a subject..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={loading || !newSubject.trim()}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Add
              </button>
            </form>
            
            <div className="flex flex-wrap gap-2">
              {authUser?.subjects?.map((subject) => (
                <span
                  key={subject}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {subject}
                  <button
                    onClick={() => handleRemoveSubject(subject)}
                    className="ml-2 inline-flex items-center p-0.5 rounded-full text-indigo-600 hover:bg-indigo-200 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <UserRating userId={authUser?.id} />

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {loading && (
          <div className="mt-4 text-indigo-600">Updating profile...</div>
        )}
      </div>
    </div>
  )
}