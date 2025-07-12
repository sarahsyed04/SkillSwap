'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function UserModerationPage() {
  const [users, setUsers] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*')
    if (error) {
      toast.error('Error loading users')
    } else {
      setUsers(data || [])
    }
  }

  const toggleBan = async (userId: string, current: boolean) => {
    const { error } = await supabase
      .from('users')
      .update({ is_banned: !current })
      .eq('id', userId)

    if (error) {
      toast.error('Failed to update user')
    } else {
      toast.success(`User ${!current ? 'banned' : 'unbanned'}`)
      fetchUsers()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">User Management</h1>

        <div className="space-y-4">
          {users.map(user => (
            <div key={user.id} className="bg-white border rounded p-4 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-gray-800">{user.full_name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">Banned: {user.is_banned ? 'Yes' : 'No'}</p>
              </div>
              <Button
                variant={user.is_banned ? 'secondary' : 'destructive'}
                onClick={() => toggleBan(user.id, user.is_banned)}
              >
                {user.is_banned ? 'Unban' : 'Ban'}
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
