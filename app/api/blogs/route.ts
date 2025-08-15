// import { NextRequest, NextResponse } from 'next/server'
// import { createClient } from '@supabase/supabase-js'
// import { sanitizeSearchParam } from '@/lib/sanitize-search-params'

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )

// export async function GET(req: NextRequest) {

//   const { searchParams } = new URL(req.url)
//   const rawSearch = searchParams.get('search') ?? undefined
//   const search = sanitizeSearchParam(rawSearch)

//    let query = supabase.from('blogs').select('*').order('created_at', { ascending: false })
   
   

//   if (search) {
//     query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,slug.ilike.%${search}`)
//   }

//   const { data: blogs, error } = await query

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
//   // console.log("BLOGS", NextResponse.json({ blogs }));
//   return NextResponse.json({ blogs })
// }
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = supabaseServer();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.trim() || '';

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  const { data: blogs, error: blogError } = await supabase
    .from('blogs')
    .select('id, slug, title, description, created_at, likes')
    .ilike('title', `%${search}%`)
    .order('likes', {ascending: false})
    .order('created_at', { ascending: false }); 

  if (blogError) {
    return NextResponse.json({ blogs: [], likedIds: [], error: blogError.message }, { status: 500 });
  }

  // let likedIds: string[] = [];
  // if (user) {
  //   const { data: likes, error: likesError  } = await supabase
  //     .from('blog_likes')
  //     .select('blog_id')
  //     .eq('user_id', user.id);

  //   if (!likesError && likes)
  //   likedIds = likes?.map((like) => like.blog_id) || [];
  // }


  // console.log('User:', user)

  return NextResponse.json({ blogs });
}
