import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSkillSchema } from '@/lib/validations'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { SKILL_CATEGORIES, PROFICIENCY_LEVELS } from '@/lib/constants'
import { Plus, X, Star } from 'lucide-react'
import toast from 'react-hot-toast'

interface SkillManagerProps {
  userId: string
}

export function SkillManager({ userId }: SkillManagerProps) {
  const [skills, setSkills] = useState<any[]>([])
  const [userSkills, setUserSkills] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(userSkillSchema)
  })

  const skillType = watch('skill_type')

  useEffect(() => {
    fetchSkills()
    fetchUserSkills()
  }, [])

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_approved', true)
      .order('name')

    if (!error && data) {
      setSkills(data)
    }
  }

  const fetchUserSkills = async () => {
    const { data, error } = await supabase
      .from('user_skills')
      .select(`
        *,
        skills (name, category)
      `)
      .eq('user_id', userId)

    if (!error && data) {
      setUserSkills(data)
    }
  }

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('user_skills')
        .insert({
          ...data,
          user_id: userId
        })

      if (error) throw error

      toast.success('Skill added successfully!')
      reset()
      setShowAddForm(false)
      fetchUserSkills()
    } catch (error) {
      console.error('Error adding skill:', error)
      toast.error('Failed to add skill')
    } finally {
      setLoading(false)
    }
  }

  const removeSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('id', skillId)

      if (error) throw error

      toast.success('Skill removed successfully!')
      fetchUserSkills()
    } catch (error) {
      console.error('Error removing skill:', error)
      toast.error('Failed to remove skill')
    }
  }

  const getProficiencyColor = (level: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-blue-100 text-blue-800',
      advanced: 'bg-purple-100 text-purple-800',
      expert: 'bg-orange-100 text-orange-800'
    }
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const offeredSkills = userSkills.filter(skill => skill.skill_type === 'offer')
  const wantedSkills = userSkills.filter(skill => skill.skill_type === 'want')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Skills</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add New Skill</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Skill"
                placeholder="Select a skill"
                options={skills.map(skill => ({
                  value: skill.id,
                  label: `${skill.name} (${skill.category})`
                }))}
                error={errors.skill_id?.message}
                {...register('skill_id')}
              />

              <Select
                label="Type"
                placeholder="Select type"
                options={[
                  { value: 'offer', label: 'I can teach this' },
                  { value: 'want', label: 'I want to learn this' }
                ]}
                error={errors.skill_type?.message}
                {...register('skill_type')}
              />

              <Select
                label="Proficiency Level"
                placeholder="Select level"
                options={PROFICIENCY_LEVELS.map(level => ({
                  value: level,
                  label: level.charAt(0).toUpperCase() + level.slice(1)
                }))}
                error={errors.proficiency_level?.message}
                {...register('proficiency_level')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                rows={3}
                placeholder={
                  skillType === 'offer' 
                    ? "Describe your experience and what you can teach..."
                    : "Describe what you want to learn and your current level..."
                }
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                {...register('description')}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Add Skill
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills I Offer */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            Skills I Offer ({offeredSkills.length})
          </h3>
          
          {offeredSkills.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No skills offered yet. Add some skills you can teach!
            </p>
          ) : (
            <div className="space-y-3">
              {offeredSkills.map((userSkill) => (
                <div
                  key={userSkill.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {userSkill.skills.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getProficiencyColor(userSkill.proficiency_level)}`}>
                        {userSkill.proficiency_level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{userSkill.skills.category}</p>
                    {userSkill.description && (
                      <p className="text-sm text-gray-500 mt-1">{userSkill.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeSkill(userSkill.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills I Want */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Plus className="h-5 w-5 text-blue-500 mr-2" />
            Skills I Want to Learn ({wantedSkills.length})
          </h3>
          
          {wantedSkills.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No learning goals yet. Add skills you want to learn!
            </p>
          ) : (
            <div className="space-y-3">
              {wantedSkills.map((userSkill) => (
                <div
                  key={userSkill.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {userSkill.skills.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getProficiencyColor(userSkill.proficiency_level)}`}>
                        {userSkill.proficiency_level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{userSkill.skills.category}</p>
                    {userSkill.description && (
                      <p className="text-sm text-gray-500 mt-1">{userSkill.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeSkill(userSkill.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}