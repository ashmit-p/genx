import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = supabaseServer();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('written_by', params.slug)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ blogs }, { status: 200 });
}
