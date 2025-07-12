'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function SkillModerationPage() {
  const [skills, setSkills] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_approved', false)

    if (error) {
      toast.error('Error loading skills')
    } else {
      setSkills(data || [])
    }
  }

  const updateSkill = async (id: string, approve: boolean) => {
    const { error } = await supabase
      .from('skills')
      .update({ is_approved: approve })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update skill')
    } else {
      toast.success(`Skill ${approve ? 'approved' : 'rejected'}`)
      fetchSkills()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Skill Moderation</h1>

        {skills.length === 0 && <p className="text-gray-500">No pending skills.</p>}

        <div className="space-y-4">
          {skills.map(skill => (
            <div key={skill.id} className="bg-white border rounded p-4 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-gray-800">{skill.name}</h2>
                <p className="text-sm text-gray-500">{skill.category}</p>
                <p className="text-sm mt-1 text-gray-600">{skill.description}</p>
              </div>
              <div className="space-x-2">
                <Button size="sm" onClick={() => updateSkill(skill.id, true)}>Approve</Button>
                <Button variant="destructive" size="sm" onClick={() => updateSkill(skill.id, false)}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
