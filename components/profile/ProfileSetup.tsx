import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema } from '@/lib/validations'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, MapPin, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProfileSetupProps {
  user: any
  onComplete: () => void
}

export function ProfileSetup({ user, onComplete }: ProfileSetupProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user.user_metadata?.full_name || '',
      location: '',
      bio: ''
    }
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          ...data,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Profile created successfully!')
      onComplete()
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error('Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Complete Your Profile
        </h1>
        <p className="text-gray-600">
          Let others know more about you to find better skill matches
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <User className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Basic Information</h2>
          </div>

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            error={errors.full_name?.message}
            {...register('full_name')}
          />

          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 text-gray-400 mt-2" />
            <div className="flex-1">
              <Input
                label="Location"
                placeholder="City, Country"
                error={errors.location?.message}
                {...register('location')}
              />
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <FileText className="h-5 w-5 text-gray-400 mt-2" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                rows={4}
                placeholder="Tell others about yourself, your interests, and what you're passionate about..."
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                {...register('bio')}
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onComplete()}
          >
            Skip for now
          </Button>
          <Button type="submit" loading={loading}>
            Complete Profile
          </Button>
        </div>
      </form>
    </div>
  )
}