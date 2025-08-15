// import { supabase } from './supabase/client';
// import TurndownService from 'turndown';
// import slugify from 'slugify';

// export type BlogSubmission = {
//   id: string;
//   title: string;
//   content: string;
//   user_id: string;
//   submitted_at: string;
//   username: string;
//   slug: string; // ✅ added
// };

// const turndownService = new TurndownService();

// export async function getPendingBlogSubmissions() {
//   const { data, error } = await supabase
//     .from('blog_submissions')
//     .select(`
//       id,
//       title,
//       content,
//       user_id,
//       submitted_at,
//       username,
//       slug
//     `)
//     .eq('status', 'pending');

//   if (error) throw error;

//   return data;
// }

// export async function updateBlogSubmissionStatus({
//   id,
//   approved,
//   reviewerId,
// }: {
//   id: string;
//   approved: boolean;
//   reviewerId: string;
// }) {
//   if (!approved) {
//     const { error } = await supabase
//       .from('blog_submissions')
//       .update({
//         status: 'rejected',
//         reviewed_at: new Date().toISOString(),
//         reviewed_by: reviewerId,
//       })
//       .eq('id', id);

//     if (error) throw error;
//     return;
//   }

//   const { data: submission, error: fetchError } = await supabase
//     .from('blog_submissions')
//     .select(`
//       title,
//       content,
//       user_id,
//       username,
//       slug
//     `)
//     .eq('id', id)
//     .single();

//   if (fetchError) throw fetchError;

//   const markdownContent = turndownService.turndown(submission.content);
//   const slug = submission.slug || slugify(submission.title, { lower: true, strict: true });

//   const { error: insertError } = await supabase.from('blogs').insert({
//     title: submission.title,
//     slug,
//     content: markdownContent,
//     written_by: submission.username,
//     created_at: new Date().toISOString(),
//   });

//   if (insertError) throw insertError;

//   const { error: deleteError } = await supabase
//     .from('blog_submissions')
//     .delete()
//     .eq('id', id);

//   if (deleteError) throw deleteError;
// }

// export async function getBlogSubmissionBySlug(slug: string): Promise<BlogSubmission | null> {
//   const { data, error } = await supabase
//     .from('blog_submissions')
//     .select(`
//       id,
//       title,
//       content,
//       user_id,
//       submitted_at,
//       username,
//       slug
//     `)
//     .eq('slug', slug)
//     .maybeSingle  ();

//   if (error) {
//     console.error('❌ Error fetching submission by slug:', error);
//     return null;
//   }

//   return data;
// }

import { supabase } from './supabase/client';
// import { supabaseAdmin } from './supabase/server';
import TurndownService from 'turndown';
import slugify from 'slugify';

export type BlogSubmission = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  submitted_at: string;
  username: string;
  slug: string;
  description: string; // ✅ Added
};

const turndownService = new TurndownService();

export async function getPendingBlogSubmissions() {
  const { data, error } = await supabase
    .from('blog_submissions')
    .select(`
      id,
      title,
      content,
      user_id,
      submitted_at,
      username,
      slug,
      description
    `)
    .eq('status', 'pending');

  if (error) throw error;

  return data;
}
export async function updateBlogSubmissionStatus({
  id,
  approved,
  reviewerId,
}: {
  id: string;
  approved: boolean;
  reviewerId: string;
}) {
  console.log('🔍 Starting blog submission update...');

  if (!approved) {
    console.log('🟥 Submission is being rejected...');

    const { error } = await supabase
      .from('blog_submissions')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId,
      })
      .eq('id', id);

    if (error) {
      console.error('❌ Error rejecting submission:', error);
      throw error;
    }

    console.log('✅ Rejected successfully.');
    return;
  }

  console.log('🟩 Submission is being approved...');

  const { data: submission, error: fetchError } = await supabase
    .from('blog_submissions')
    .select(`title, content, user_id, username, slug, description`)
    .eq('id', id)
    .single();

  if (fetchError || !submission) {
    console.error('❌ Failed to fetch submission:', fetchError);
    throw fetchError;
  }

  console.log('✅ Submission fetched:', submission);

  const markdownContent = turndownService.turndown(submission.content);
  const slug = submission.slug || slugify(submission.title, { lower: true, strict: true });

  const { error: insertError } = await supabase.from('blogs').insert({
    title: submission.title,
    slug,
    content: markdownContent,
    written_by: submission.username,
    created_at: new Date().toISOString(),
    description: submission.description,
  });

  if (insertError) {
    console.error('❌ Failed to insert blog:', insertError);
    throw insertError;
  }

  // console.log('✅ Blog inserted, now updating blog_submissions status...');

  // const { data: updatedSubmission, error: updateError } = await supabase
  //   .from('blog_submissions')
  //   .update({
  //     status: 'approved',
  //     reviewed_at: new Date().toISOString(),
  //     reviewed_by: reviewerId,
  //   })
  //   .eq('id', id).select();
// const { data, error, status } = await supabaseAdmin
//   .from('blog_submissions')
//   .update({
//     status: 'approved',
//     reviewed_at: new Date().toISOString(),
//     reviewed_by: 'ADMIN_ID',
//   })
//   .eq('id', '39b6702a-02e0-43ca-9c0b-13416ef6e7c1')
//   .select();

// console.log('🧪 UPDATE result:', { statusCode: status, data, error });
}
