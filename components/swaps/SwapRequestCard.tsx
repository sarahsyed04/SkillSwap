import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { Clock, CheckCircle, XCircle, Calendar, User } from 'lucide-react'
import toast from 'react-hot-toast'

interface SwapRequestCardProps {
  request: any
  currentUserId: string
  onUpdate: () => void
}

export function SwapRequestCard({ request, currentUserId, onUpdate }: SwapRequestCardProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const isRequester = request.requester_id === currentUserId
  const canRespond = !isRequester && request.status === 'pending'
  const canCancel = isRequester && request.status === 'pending'

  const updateStatus = async (status: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('swap_requests')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id)

      if (error) throw error

      toast.success(`Request ${status} successfully!`)
      onUpdate()
    } catch (error) {
      console.error('Error updating request:', error)
      toast.error('Failed to update request')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {getStatusIcon(request.status)}
            <span className="ml-1 capitalize">{request.status}</span>
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {formatDate(request.created_at)}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {isRequester ? 'To' : 'From'}: {isRequester ? request.provider?.full_name : request.requester?.full_name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-1">
              {isRequester ? 'You want to learn' : 'They want to learn'}
            </h4>
            <p className="text-sm text-blue-700">{request.requested_skill?.name}</p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-1">
              {isRequester ? 'You offer' : 'You can teach'}
            </h4>
            <p className="text-sm text-green-700">{request.offered_skill?.name}</p>
          </div>
        </div>

        {request.message && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-1">Message</h4>
            <p className="text-sm text-gray-700">{request.message}</p>
          </div>
        )}

        {request.scheduled_date && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Scheduled for: {formatDate(request.scheduled_date)}</span>
          </div>
        )}
      </div>

      {(canRespond || canCancel) && (
        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
          {canRespond && (
            <>
              <Button
                variant="outline"
                onClick={() => updateStatus('rejected')}
                loading={loading}
              >
                Decline
              </Button>
              <Button
                onClick={() => updateStatus('accepted')}
                loading={loading}
              >
                Accept
              </Button>
            </>
          )}
          
          {canCancel && (
            <Button
              variant="destructive"
              onClick={() => updateStatus('cancelled')}
              loading={loading}
            >
              Cancel Request
            </Button>
          )}
        </div>
      )}
    </div>
  )
}