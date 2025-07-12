import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ratingSchema } from '@/lib/validations'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Star } from 'lucide-react'
import toast from 'react-hot-toast'

interface FeedbackFormProps {
  swapRequest: any
  currentUserId: string
  onSubmit: () => void
}

export function FeedbackForm({ swapRequest, currentUserId, onSubmit }: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(ratingSchema)
  })

  const ratedUserId = swapRequest.requester_id === currentUserId 
    ? swapRequest.provider_id 
    : swapRequest.requester_id

  const ratedUserName = swapRequest.requester_id === currentUserId
    ? swapRequest.provider?.full_name
    : swapRequest.requester?.full_name

  const onSubmitForm = async (data: any) => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('ratings')
        .insert({
          swap_request_id: swapRequest.id,
          rater_id: currentUserId,
          rated_id: ratedUserId,
          rating,
          feedback: data.feedback || null
        })

      if (error) throw error

      // Update swap request status to completed
      await supabase
        .from('swap_requests')
        .update({ status: 'completed' })
        .eq('id', swapRequest.id)

      toast.success('Feedback submitted successfully!')
      onSubmit()
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error('Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Rate your experience with {ratedUserName}
      </h3>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-colors"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {rating === 0 && 'Click to rate'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Feedback (Optional)
          </label>
          <textarea
            rows={4}
            placeholder="Share your experience, what you learned, and any suggestions..."
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            {...register('feedback')}
          />
          {errors.feedback && (
            <p className="mt-1 text-sm text-red-600">{errors.feedback.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSubmit}
          >
            Skip
          </Button>
          <Button type="submit" loading={loading}>
            Submit Feedback
          </Button>
        </div>
      </form>
    </div>
  )
}