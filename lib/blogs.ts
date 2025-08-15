import { supabase } from './supabase/client'

export async function getBlogs() {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
