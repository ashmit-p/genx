import { auth } from './firebase';

export async function fetchChatHistory(
  roomId: string, 
  pageSize = 10, 
  lastMessageId?: string, 
  lastTimestamp?: string
) {
  try {
    // Get the current user's ID token
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const token = await user.getIdToken();
    
    // Build query parameters
    const params = new URLSearchParams({
      roomId: roomId,
      pageSize: pageSize.toString()
    });
    
    if (lastMessageId && lastTimestamp) {
      params.append('lastMessageId', lastMessageId);
      params.append('lastTimestamp', lastTimestamp);
    }
    
    // Make API call to fetch chat history
    const response = await fetch(`/api/chat/messages?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }

    const data = await response.json();
    return {
      messages: data.messages || [],
      hasMore: data.hasMore || false,
      lastMessageId: data.lastMessageId,
      lastTimestamp: data.lastTimestamp
    };
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return {
      messages: [],
      hasMore: false,
      lastMessageId: null,
      lastTimestamp: null
    };
  }
}
