import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { getBotRecommendation, getBotDisplayName, getBotDescription } from '@/lib/ai/recommend-bot';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const onboardingData = await req.json();

    if (!onboardingData || typeof onboardingData !== 'object') {
      return NextResponse.json({ error: 'Invalid onboarding data' }, { status: 400 });
    }

    const recommendedBot = await getBotRecommendation(onboardingData);
    const botDisplayName = getBotDisplayName(recommendedBot);
    const botDescription = getBotDescription(recommendedBot);

    await adminDb.collection('users').doc(userId).update({
      onboarding_data: onboardingData,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      recommended_bot: recommendedBot,
      recommended_bot_display_name: botDisplayName,
      recommended_bot_description: botDescription
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Onboarding data saved successfully',
      recommendedBot: recommendedBot,
      botDisplayName: botDisplayName,
      botDescription: botDescription
    });

  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return NextResponse.json({ 
      error: 'Failed to save onboarding data' 
    }, { status: 500 });
  }
}
