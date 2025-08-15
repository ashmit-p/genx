export async function updateUserAvatarUrl(publicUrl: string, userId: string) {
  const res = await fetch('/api/avatar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ avatarUrl: publicUrl, userId }),
  })

  if (!res.ok) throw new Error('Failed to update avatar')
}
