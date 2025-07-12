'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { SwapRequestCard } from '@/components/swaps/SwapRequestCard'
import { FeedbackForm } from '@/components/feedback/FeedbackForm'
import { useRealtime } from '@/lib/hooks/useRealtime'

export default function MySwaps() {
  const [user, setUser] = useState<any>(null)
  const [swapRequests, setSwapRequests] = useState<any[]>([])
  const [showFeedbackFor, setShowFeedbackFor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchSwapRequests()
    }
  }, [user])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/signin')
      return
    }
    setUser(user)
  }

  const fetchSwapRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('swap_requests')
        .select(`
          *,
          requester:users!requester_id(full_name, email),
          provider:users!provider_id(full_name, email),
          requested_skill:skills!requested_skill_id(name, category),
          offered_skill:skills!offered_skill_id(name, category)
        `)
        .or(`requester_id.eq.${user.id},provider_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSwapRequests(data || [])
    } catch (error) {
      console.error('Error fetching swap requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFeedbackSubmit = () => {
    setShowFeedbackFor(null)
    fetchSwapRequests()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const feedbackRequest = swapRequests.find(req => req.id === showFeedbackFor)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Swaps</h1>
          <p className="text-gray-600">Manage your skill exchange requests</p>
        </div>

        {showFeedbackFor && feedbackRequest && (
          <div className="mb-8">
            <FeedbackForm
              swapRequest={feedbackRequest}
              currentUserId={user.id}
              onSubmit={handleFeedbackSubmit}
            />
          </div>
        )}

        <div className="space-y-6">
          {swapRequests.map((request) => (
            <SwapRequestCard
              key={request.id}
              request={request}
              currentUserId={user.id}
              onUpdate={fetchSwapRequests}
            />
          ))}
        </div>

        {swapRequests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No swap requests yet.</p>
          </div>
        )}
      </main>
    </div>
  )
}