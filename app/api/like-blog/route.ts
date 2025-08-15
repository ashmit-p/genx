import { NextResponse } from 'next/server'
import { supabaseAdmin } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token)

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { blogId } = await req.json()

   const { data: existingLike } = await supabaseAdmin
    .from('blog_likes')
    .select('id')
    .eq('blog_id', blogId)
    .eq('user_id', user.id)
    .single()

     if (existingLike) {
      const { error: deleteError } = await supabaseAdmin
        .from('blog_likes')
        .delete()
        .eq('id', existingLike.id)

      if (deleteError) {
        return NextResponse.json({ error: 'Failed to unlike blog' }, { status: 500 })
      }

      return NextResponse.json({ liked: false })
    } else {
      
      const { error: likeError } = await supabaseAdmin
        .from('blog_likes')
        .upsert({ blog_id: blogId, user_id: user.id }, { onConflict: 'blog_id, user_id' })

      if (likeError) {
        return NextResponse.json({ error: likeError.message }, { status: 500 })
      }

      return NextResponse.json({ liked: true })
    }
}
