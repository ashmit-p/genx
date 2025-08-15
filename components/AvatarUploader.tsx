/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { useState, useEffect } from "react";
import { updateUserAvatarUrl } from "@/lib/avatar";
import useUser from "@/lib/hooks/useUser";
import Image from "next/image";
import toast from "react-hot-toast";
import { Loader2, User } from "lucide-react";

export default function AvatarUploader() {
  const { user, refetch } = useUser();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.avatar_url) {
      setAvatarUrl(user.avatar_url);
    }
  }, [user]);

  const handleUploadComplete = async (res: any): Promise<void> => {
    const uploadedUrl = res[0]?.url?.trim();
    if (!uploadedUrl) {
      toast.error("Upload failed");
      return;
    }

    try {
      setUploading(true);
      if (!user?.id) {
        toast.error("User not found");
        return;
      }
      await updateUserAvatarUrl(uploadedUrl, user.id);
      setAvatarUrl(uploadedUrl);
      toast.success("Avatar updated!");
      refetch();
    } catch (e: any) {
      toast.error("Failed to update avatar");
    } finally {
      setUploading(false);
    }
  };


 const handleDelete = async () => {
    if (!confirm("Delete avatar?")) return;

    try {
      setUploading(true);
      if (!user?.id) {
        toast.error("User not found");
        return;
      }
      await updateUserAvatarUrl("", user.id)
      setAvatarUrl(null);
      toast.success("Avatar removed");
      refetch();
    } catch (err: any) {
      toast.error("Failed to delete avatar");
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="flex flex-col items-center gap-4">
      {avatarUrl ? (
        <Image
          src={avatarUrl.trim()}
          alt="avatar"
          width={96}
          height={96}
          className="rounded-full object-cover border-2 border-emerald-500 cursor-pointer"
          onClick={handleDelete}
        />
      ) : (
        <div
          onClick={handleDelete}
          className="w-24 h-24 rounded-full bg-gray-300 grid place-items-center cursor-pointer"
        >
          <User size={45} />
        </div>
      )}

    <UploadButton<OurFileRouter, "avatarUploader">
      endpoint="avatarUploader"
      onClientUploadComplete={handleUploadComplete}
      onUploadError={(e) => { toast.error(e.message) }}
      appearance={{
        button: "bg-emerald-500 px-3 py-1 rounded text-white text-sm",
      }}
      content={{
        button({ ready }) {
          return ready ? "Upload New Avatar" : "Preparing...";
        },
      }}
    />

      {uploading && <Loader2 className="animate-spin w-5 h-5 text-emerald-500" />}
    </div>
  );
}
