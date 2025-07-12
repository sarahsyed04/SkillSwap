'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import toast from 'react-hot-toast'

export default function SwapRequestPage() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const router = useRouter()

  const providerId = searchParams.get('provider')
  const [user, setUser] = useState<any>(null)
  const [offeredSkills, setOfferedSkills] = useState<any[]>([])
  const [requestedSkills, setRequestedSkills] = useState<any[]>([])
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('')
  const [selectedRequestedSkill, setSelectedRequestedSkill] = useState('')
  const [message, setMessage] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user && providerId) {
      fetchUserSkills()
    }
  }, [user, providerId])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/signin')
      return
    }
    setUser(user)
  }

  const fetchUserSkills = async () => {
    const [mySkills, theirSkills] = await Promise.all([
      supabase
        .from('user_skills')
        .select(`
          id,
          skill_type,
          proficiency_level,
          skill_id,
          skills (name)
        `)
        .eq('user_id', user.id)
        .eq('skill_type', 'offer'),

      supabase
        .from('user_skills')
        .select(`
          id,
          skill_type,
          proficiency_level,
          skill_id,
          skills (name)
        `)
        .eq('user_id', providerId)
        .eq('skill_type', 'offer')
    ])

    if (mySkills.error || theirSkills.error) {
      toast.error('Error loading skills.')
      return
    }

    setOfferedSkills(mySkills.data || [])
    setRequestedSkills(theirSkills.data || [])
  }

  const handleSubmit = async () => {
    if (!selectedOfferedSkill || !selectedRequestedSkill) {
      toast.error('Please select both skills.')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('swap_requests').insert({
      requester_id: user.id,
      provider_id: providerId,
      offered_skill_id: selectedOfferedSkill,
      requested_skill_id: selectedRequestedSkill,
      message,
      scheduled_date: date ? new Date(date).toISOString() : null,
      status: 'pending'
    })

    if (error) {
      toast.error('Failed to send request.')
    } else {
      toast.success('Swap request sent!')
      router.push('/my-swaps')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Request a Skill Swap</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Their Skill (You want to learn)</label>
            <Select
              value={selectedRequestedSkill}
              onChange={(e) => setSelectedRequestedSkill(e.target.value)}
              placeholder="Select a skill they offer"
              options={requestedSkills.map(skill => ({
                value: skill.skill_id,
                label: skill.skills.name
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Skill (You can offer)</label>
            <Select
              value={selectedOfferedSkill}
              onChange={(e) => setSelectedOfferedSkill(e.target.value)}
              placeholder="Select a skill you offer"
              options={offeredSkills.map(skill => ({
                value: skill.skill_id,
                label: skill.skills.name
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say hello or explain what you're looking for"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date (optional)</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleSubmit} loading={loading} className="w-full">
              Send Swap Request
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
