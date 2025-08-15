/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Button } from '@/components/ui/button'; 
import Link from 'next/link';
import React from 'react';

type Props = {
  id: string;
  title: string;
//   description: string;
  content: string;
  userName: string;
  slug: string;
  onApprove: () => void;
  onReject: () => void;
};

export default function BlogReviewCard({ id, title, slug, content, userName, onApprove, onReject }: Props) {
  return (
    <div className="max-w-sm bg-white/10 shadow-md hover:shadow-xl transition-shadow duration-300 p-5 rounded-xl border border-orange-100">
      <h2 className="text-xl font-semibold mb-2 gowun-dodum-regular text-white">{title}</h2>
      <p className="text-white/40 text-sm mb-1 alumni-sans-pinstripe-regular-italic ">Submitted by: {userName}</p>
      <p className="text-white whitespace-pre-wrap mt-2 line-clamp-3 overflow-hidden">{content}</p>
      <div className="flex gap-3 mt-4">
        <Button className="bg-green-600 cursor-pointer" onClick={onApprove}>Approve</Button>
        <Button className="bg-red-600 cursor-pointer" onClick={onReject}>Reject</Button>
        <Link href={`/admin/blog-review/${slug}`} ><Button className='bg-blue-900 p-4 cursor-pointer'> Open </Button></Link>
      </div>
    </div>
  );
}
