export interface OnboardingData {
  // Demographics
  age_range: string;
  gender: string;
  location_type: string;
  
  // Mental Health Background
  therapy_experience: string;
  current_support: string[];
  comfort_level: number;
  
  // Goals & Preferences
  primary_goals: string[];
  preferred_approach: string;
  communication_style: string;
  
  // Current Challenges
  main_challenges: string[];
  stress_level: number;
  
  // Platform Preferences
  preferred_features: string[];
  privacy_comfort: number;
  time_availability: string;
}

export async function getBotRecommendation(onboardingData: OnboardingData): Promise<string> {
  let supportiveScore = 0;
  let practicalScore = 0;
  let friendlyScore = 0;

  // Score based on therapy experience
  switch (onboardingData.therapy_experience) {
    case 'Never':
      friendlyScore += 2; // New users might prefer friendly approach
      supportiveScore += 1;
      break;
    case 'Once or twice':
      supportiveScore += 2;
      friendlyScore += 1;
      break;
    case 'Several times':
    case 'Currently in therapy':
    case 'Regular therapy user':
      practicalScore += 2; // Experienced users might want practical advice
      supportiveScore += 1;
      break;
  }

  // Score based on comfort level discussing personal topics
  if (onboardingData.comfort_level <= 2) {
    friendlyScore += 2; // Low comfort = casual approach
    supportiveScore += 1;
  } else if (onboardingData.comfort_level >= 4) {
    practicalScore += 1; // High comfort = can handle direct advice
    supportiveScore += 2;
  }

  // Score based on primary goals
  onboardingData.primary_goals?.forEach(goal => {
    switch (goal) {
      case 'Manage anxiety or stress':
      case 'Overcome depression':
        supportiveScore += 2;
        break;
      case 'Build self-confidence':
      case 'Develop coping strategies':
        practicalScore += 2;
        break;
      case 'Improve relationships':
      case 'Just someone to talk to':
        friendlyScore += 2;
        break;
      case 'Cope with life changes':
        supportiveScore += 1;
        practicalScore += 1;
        break;
    }
  });

  // Score based on preferred approach
  switch (onboardingData.preferred_approach) {
    case 'Practical, solution-focused advice':
      practicalScore += 3;
      break;
    case 'Emotional support and validation':
      supportiveScore += 3;
      break;
    case 'Gentle guidance and encouragement':
      supportiveScore += 2;
      friendlyScore += 1;
      break;
    case 'Direct, honest feedback':
      practicalScore += 2;
      break;
    case 'Mix of different approaches':
      // No specific bonus, let other factors decide
      break;
  }

  // Score based on communication style
  switch (onboardingData.communication_style) {
    case 'Formal and professional':
      practicalScore += 2;
      break;
    case 'Friendly and casual':
      friendlyScore += 3;
      break;
    case 'Warm and empathetic':
      supportiveScore += 3;
      break;
    case 'Direct and straightforward':
      practicalScore += 2;
      break;
  }

  // Score based on current challenges
  onboardingData.main_challenges?.forEach(challenge => {
    switch (challenge) {
      case 'Work-related stress':
      case 'Academic pressure':
        practicalScore += 1;
        break;
      case 'Relationship issues':
      case 'Social isolation':
      case 'Grief or loss':
        supportiveScore += 2;
        break;
      case 'Family problems':
      case 'Identity questions':
        friendlyScore += 1;
        supportiveScore += 1;
        break;
      case 'Financial concerns':
      case 'Health issues':
        practicalScore += 1;
        supportiveScore += 1;
        break;
    }
  });

  // Score based on stress level
  if (onboardingData.stress_level >= 8) {
    supportiveScore += 2; // High stress needs support
  } else if (onboardingData.stress_level <= 4) {
    friendlyScore += 1; // Low stress can handle casual approach
    practicalScore += 1;
  }

  // Score based on preferred features
  onboardingData.preferred_features?.forEach(feature => {
    switch (feature) {
      case 'AI Therapy Chat':
        supportiveScore += 1;
        break;
      case 'Community discussions':
        friendlyScore += 1;
        break;
      case 'Self-help resources':
      case 'Progress tracking':
        practicalScore += 1;
        break;
    }
  });

  // Determine the winner
  const scores = [
    { type: 'supportive', score: supportiveScore },
    { type: 'practical', score: practicalScore },
    { type: 'friendly', score: friendlyScore }
  ];

  // Sort by score (highest first)
  scores.sort((a, b) => b.score - a.score);

  // Return the personality type with the highest score
  // If there's a tie, prefer supportive as the default
  if (scores[0].score === scores[1].score) {
    return 'supportive';
  }

  return scores[0].type;
}

// Helper function to get bot display name
export function getBotDisplayName(botType: string): string {
  switch (botType) {
    case 'practical':
      return 'Practical Coach';
    case 'supportive':
      return 'Supportive Therapist';
    case 'friendly':
      return 'Friendly Companion';
    default:
      return 'Supportive Therapist';
  }
}

// Helper function to get bot description
export function getBotDescription(botType: string): string {
  switch (botType) {
    case 'practical':
      return 'Solution-oriented approach with actionable steps and practical advice';
    case 'supportive':
      return 'Gentle, encouraging support focused on emotional validation and understanding';
    case 'friendly':
      return 'Casual, empathetic conversations like talking with a supportive friend';
    default:
      return 'Gentle, encouraging support focused on emotional validation and understanding';
  }
}
