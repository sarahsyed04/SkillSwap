import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type Tables = keyof Database['public']['Tables']
type TableRow<T extends Tables> = Database['public']['Tables'][T]['Row']

export function useRealtime<T extends Tables>(
  table: T,
  filter?: string,
  initialData?: TableRow<T>[]
) {
  const [data, setData] = useState<TableRow<T>[]>(initialData || [])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      let query = supabase.from(table).select('*')
      
      if (filter) {
        // Simple filter parsing - can be enhanced
        const [column, operator, value] = filter.split(':')
        query = query.filter(column, operator as any, value)
      }

      const { data: fetchedData, error } = await query
      if (!error && fetchedData) {
        setData(fetchedData as TableRow<T>[])
      }
      setLoading(false)
    }

    fetchData()

    // Set up real-time subscription
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData(prev => [...prev, payload.new as TableRow<T>])
          } else if (payload.eventType === 'UPDATE') {
            setData(prev => prev.map(item => 
              (item as any).id === (payload.new as any).id ? payload.new as TableRow<T> : item
            ))
          } else if (payload.eventType === 'DELETE') {
            setData(prev => prev.filter(item => (item as any).id !== (payload.old as any).id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, filter])

  return { data, loading, setData }
}