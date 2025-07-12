import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Users, MessageSquare, Star, TrendingUp, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSwaps: 0,
    averageRating: 0,
    pendingSkills: 0
  })
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchStats()
    fetchChartData()
  }, [])

  const fetchStats = async () => {
    try {
      const [usersResult, swapsResult, ratingsResult, skillsResult] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('swap_requests').select('id', { count: 'exact' }),
        supabase.from('ratings').select('rating'),
        supabase.from('skills').select('id', { count: 'exact' }).eq('is_approved', false)
      ])

      const totalUsers = usersResult.count || 0
      const totalSwaps = swapsResult.count || 0
      const pendingSkills = skillsResult.count || 0
      
      const ratings = ratingsResult.data || []
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0

      setStats({
        totalUsers,
        totalSwaps,
        averageRating: Math.round(averageRating * 10) / 10,
        pendingSkills
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchChartData = async () => {
    try {
      const { data, error } = await supabase
        .from('swap_requests')
        .select('created_at, status')
        .order('created_at', { ascending: true })

      if (error) throw error

      // Group by month
      const monthlyData = data.reduce((acc: any, swap) => {
        const month = new Date(swap.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        })
        
        if (!acc[month]) {
          acc[month] = { month, total: 0, completed: 0 }
        }
        
        acc[month].total++
        if (swap.status === 'completed') {
          acc[month].completed++
        }
        
        return acc
      }, {})

      setChartData(Object.values(monthlyData))
    } catch (error) {
      console.error('Error fetching chart data:', error)
    }
  }

  const exportReport = async () => {
    try {
      const { data: users } = await supabase
        .from('users')
        .select('full_name, email, location, created_at')

      const { data: swaps } = await supabase
        .from('swap_requests')
        .select(`
          *,
          requester:users!requester_id(full_name, email),
          provider:users!provider_id(full_name, email),
          requested_skill:skills!requested_skill_id(name),
          offered_skill:skills!offered_skill_id(name)
        `)

      const { data: ratings } = await supabase
        .from('ratings')
        .select(`
          *,
          rater:users!rater_id(full_name, email),
          rated:users!rated_id(full_name, email)
        `)

      // Create CSV content
      const csvContent = [
        'USERS REPORT',
        'Name,Email,Location,Join Date',
        ...users?.map(u => `"${u.full_name}","${u.email}","${u.location || 'N/A'}","${new Date(u.created_at).toLocaleDateString()}"`) || [],
        '',
        'SWAPS REPORT',
        'Requester,Provider,Requested Skill,Offered Skill,Status,Date',
        ...swaps?.map(s => `"${s.requester?.full_name}","${s.provider?.full_name}","${s.requested_skill?.name}","${s.offered_skill?.name}","${s.status}","${new Date(s.created_at).toLocaleDateString()}"`) || [],
        '',
        'RATINGS REPORT',
        'Rater,Rated,Rating,Feedback,Date',
        ...ratings?.map(r => `"${r.rater?.full_name}","${r.rated?.full_name}","${r.rating}","${r.feedback || 'N/A'}","${new Date(r.created_at).toLocaleDateString()}"`) || []
      ].join('\n')

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `skillswap-report-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting report:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button onClick={exportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
      
      {/* Admin Panels */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-2">Skill Moderation</h2>
    <p className="text-sm text-gray-600 mb-4">Approve or reject new skill submissions.</p>
    <Button onClick={() => window.location.href = '/admin/skills'}>Go to Panel</Button>
  </div>

  <div className="bg-white rounded-lg shadow-sm border p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-2">User Management</h2>
    <p className="text-sm text-gray-600 mb-4">Ban/unban users and monitor accounts.</p>
    <Button onClick={() => window.location.href = '/admin/users'}>Go to Panel</Button>
  </div>

  <div className="bg-white rounded-lg shadow-sm border p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-2">Announcements</h2>
    <p className="text-sm text-gray-600 mb-4">Create site-wide updates for users.</p>
    <Button onClick={() => window.location.href = '/admin/announcements'}>Go to Panel</Button>
  </div>
</div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Swaps</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSwaps}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Skills</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingSkills}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Swap Activity Over Time</h2>
        <div className="h-80">
        </div>
      </div>
    </div>
  )
}