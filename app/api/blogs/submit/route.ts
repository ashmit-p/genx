import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import slugify from 'slugify';

export async function POST(req: Request) {
  const { title, content, desc } = await req.json();
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
  }

  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch username from public.users
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('users')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profileError || !profile?.username) {
    return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
  }

  let slug = slugify(title, { lower: true, strict: true });

  const { data: existing } = await supabaseAdmin
    .from('blog_submissions')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (existing) {
    const timestamp = Date.now().toString().slice(-5);
    slug = `${slug}-${timestamp}`;
  }

  const { error } = await supabaseAdmin.from('blog_submissions').insert([
    {
      user_id: user.id,
      username: profile.username,
      title,
      content,
      description: desc,
      slug,
      status: 'pending',
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, slug });
}
