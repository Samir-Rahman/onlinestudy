import { useEffect, useState } from 'react'
import { authStore } from '../store/useAuthStore'

export const Rating = () => {
  const { authUser, updateRating, fetchAverageRating, averageRating, totalRatings } = authStore()
  const [userRating, setUserRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAverageRating()
  }, [])

  const handleRating = async (rating) => {
    if (!authUser) {
      setError('Please login to rate')
      return
    }

    setLoading(true)
    setError('')
    try {
      const result = await updateRating(rating)
      if (result.success) {
        setUserRating(rating)
        await fetchAverageRating()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to update rating')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2">Rate Our Website</h3>
      <div className="flex items-center space-x-2 mb-4">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="focus:outline-none"
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-8 w-8 transition-colors ${
                  star <= (hover || userRating)
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

      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">
          {averageRating ? averageRating.toFixed(1) : '0'}<span className="text-lg font-normal">/5</span>
        </div>
        <div className="text-sm text-gray-600">
          Based on {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
        </div>
      </div>

      {loading && <div className="mt-2 text-sm text-indigo-600">Updating rating...</div>}
      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}
    </div>
  )
}