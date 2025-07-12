'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { SKILL_CATEGORIES } from '@/lib/constants'
import { Search, MapPin, Star, MessageSquare } from 'lucide-react'
import { getInitials, calculateAverageRating } from '@/lib/utils'

export default function Browse() {
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, selectedCategory])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/signin')
      return
    }
    setUser(user)
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_skills!inner (
            skill_type,
            proficiency_level,
            description,
            skills (name, category)
          ),
          ratings_received:ratings!rated_id (rating)
        `)
        .eq('user_skills.skill_type', 'offer')
        .eq('is_banned', false)

      if (error) throw error

      // Group user skills and calculate ratings
      const processedUsers = data?.reduce((acc: any[], user) => {
        const existingUser = acc.find(u => u.id === user.id)
        
        if (existingUser) {
          existingUser.user_skills.push(...user.user_skills)
        } else {
          acc.push({
            ...user,
            average_rating: calculateAverageRating(user.ratings_received || [])
          })
        }
        
        return acc
      }, []) || []

      setUsers(processedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users.filter(u => u.id !== user?.id) // Exclude current user

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_skills.some((skill: any) =>
          skill.skills.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(user =>
        user.user_skills.some((skill: any) =>
          skill.skills.category === selectedCategory
        )
      )
    }

    setFilteredUsers(filtered)
  }

  const sendSwapRequest = (providerId: string) => {
    router.push(`/swap-request?provider=${providerId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Skills</h1>
          <p className="text-gray-600">Find people who can teach you new skills</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                placeholder="Search by name or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            
            <Select
              placeholder="Filter by category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
                { value: '', label: 'All Categories' },
                ...SKILL_CATEGORIES.map(cat => ({ value: cat, label: cat }))
              ]}
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((userProfile) => (
            <div key={userProfile.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {getInitials(userProfile.full_name)}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">{userProfile.full_name}</h3>
                  {userProfile.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {userProfile.location}
                    </div>
                  )}
                </div>
              </div>

              {userProfile.average_rating > 0 && (
                <div className="flex items-center mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">
                    {userProfile.average_rating} rating
                  </span>
                </div>
              )}

              {userProfile.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{userProfile.bio}</p>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Offered:</h4>
                <div className="flex flex-wrap gap-1">
                  {userProfile.user_skills.slice(0, 3).map((userSkill: any, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {userSkill.skills.name}
                    </span>
                  ))}
                  {userProfile.user_skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{userProfile.user_skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <Button
                onClick={() => sendSwapRequest(userProfile.id)}
                className="w-full"
                size="sm"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Request Swap
              </Button>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  )
}