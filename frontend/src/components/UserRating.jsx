import { useEffect, useState } from 'react'
import { axiosInstance } from '../lib/axios'
import { authStore } from '../store/useAuthStore'

export const UserRating = ({ userId }) => {
  const { authUser } = authStore()
  const [ratings, setRatings] = useState([])
  const [stats, setStats] = useState({ averageRating: 0, totalRatings: 0 })
  const [selectedRating, setSelectedRating] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [comment, setComment] = useState('')
  const [hover, setHover] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isOwnProfile = authUser?.id === userId

  useEffect(() => {
    fetchUserRatings()
  }, [userId])

  const fetchUserRatings = async () => {
    try {
      const url = userId ? `/auth/users/ratings/${userId}` : '/auth/users/ratings'
      const res = await axiosInstance.get(url)
      setRatings(res.data.ratings)
      setStats(res.data.stats)
    } catch (err) {
      setError('Failed to fetch ratings')
    }
  }

  const handleSubmitRating = async (e) => {
    e.preventDefault()
    if (!authUser) {
      setError('Please login to rate')
      return
    }
    if (!selectedRating) {
      setError('Please select a rating')
      return
    }

    setLoading(true)
    setError('')
    try {
      await axiosInstance.post('/auth/users/rate', {
        rating: selectedRating,
        ratedUserId: userId,
        comment
      })
      setUserRating(selectedRating)
      setSelectedRating(0)
      setComment('')
      await fetchUserRatings()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-medium mb-2">
          {isOwnProfile ? 'Your Ratings' : 'Rate User'}
        </h3>
        
        {!isOwnProfile && (
          <form onSubmit={handleSubmitRating} className="w-full space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    disabled={loading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-8 w-8 transition-colors ${
                        star <= (hover || selectedRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full mb-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
                maxLength={500}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !selectedRating}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Rating'}
            </button>
          </form>
        )}

        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-gray-900">
            {stats.averageRating.toFixed(1)}<span className="text-lg font-normal">/5</span>
          </div>
          <div className="text-sm text-gray-600">
            Based on {stats.totalRatings} {stats.totalRatings === 1 ? 'rating' : 'ratings'}
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 mb-4">{error}</div>
        )}

        <div className="w-full space-y-4">
          <h4 className="font-medium">Recent Ratings</h4>
          {ratings.length > 0 ? (
            ratings.map((rating) => (
              <div key={rating._id} className="border-t pt-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={rating.raterId.profilePic || 'https://via.placeholder.com/40'}
                    alt={rating.raterId.fullname}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{rating.raterId.fullname}</div>
                    <div className="flex items-center">
                      {Array.from({ length: rating.rating }).map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                {rating.comment && (
                  <p className="mt-2 text-gray-600">{rating.comment}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No ratings yet</p>
          )}
        </div>
      </div>
    </div>
  )
}