export const SKILL_CATEGORIES = [
  'Technology',
  'Design',
  'Business',
  'Languages',
  'Arts & Crafts',
  'Music',
  'Sports & Fitness',
  'Cooking',
  'Academic',
  'Life Skills',
  'Other'
] as const

export const PROFICIENCY_LEVELS = [
  'beginner',
  'intermediate', 
  'advanced',
  'expert'
] as const

export const SWAP_STATUS = [
  'pending',
  'accepted',
  'rejected',
  'completed',
  'cancelled'
] as const

export const ANNOUNCEMENT_TYPES = [
  'info',
  'warning',
  'success',
  'error'
] as const

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
] as const

export const PAGINATION_LIMITS = {
  USERS: 12,
  SKILLS: 20,
  SWAP_REQUESTS: 10,
  RATINGS: 15
} as const