'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { ProfileSetup } from '@/components/profile/ProfileSetup'
import { SkillManager } from '@/components/skills/SkillManager'
import { Button } from '@/components/ui/Button'
import { Plus, Users, MessageSquare, Star } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/signin')
        return
      }

      setUser(user)

      // Check if user has a profile
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profileData) {
        setShowProfileSetup(true)
      } else {
        setProfile(profileData)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileComplete = () => {
    setShowProfileSetup(false)
    checkUser() // Refresh profile data
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (showProfileSetup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        <ProfileSetup user={user} onComplete={handleProfileComplete} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.full_name || user?.user_metadata?.full_name}!
          </h1>
          <p className="text-gray-600">
            Manage your skills and connect with other learners
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/browse" className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Browse Skills</h3>
                <p className="text-gray-600">Find people to learn from</p>
              </div>
            </div>
          </Link>

          <Link href="/my-swaps" className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">My Swaps</h3>
                <p className="text-gray-600">View your requests</p>
              </div>
            </div>
          </Link>

          <Link href="/profile" className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">My Profile</h3>
                <p className="text-gray-600">Update your information</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Skills Management */}
        {user && <SkillManager userId={user.id} />}
      </main>
    </div>
  )
}