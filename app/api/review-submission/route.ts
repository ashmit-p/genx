// app/api/review-submission/route.ts
import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { id, approved, reviewerId } = await req.json();

  console.log('🧪 Review request received:', { id, approved, reviewerId });

  const { error: updateError } = await supabaseAdmin
    .from('blog_submissions')
    .update({
      status: approved ? 'approved' : 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewerId,
    })
    .eq('id', id);

  if (updateError) {
    console.error('❌ Failed to update status:', updateError);
    return NextResponse.json({ success: false, error: updateError.message });
  }

  if (approved) {
    const { data: submissionData, error: fetchError } = await supabaseAdmin
      .from('blog_submissions')
      .select('title, content, user_id, slug, username')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('❌ Failed to fetch submission for blog insert:', fetchError);
      return NextResponse.json({ success: false, error: fetchError.message });
    }

    const { title, content,  slug, username, user_id } = submissionData;

    const { error: insertError } = await supabaseAdmin.from('blogs').insert([
      {
        title,
        content,
        user_id,
        slug,
        written_by: username,
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error('❌ Failed to insert into blogs:', insertError);
      return NextResponse.json({ success: false, error: insertError.message });
    }
  }

  return NextResponse.json({ success: true });
}
