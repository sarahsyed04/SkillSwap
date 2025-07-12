import { z } from 'zod'
import { SKILL_CATEGORIES, PROFICIENCY_LEVELS, ANNOUNCEMENT_TYPES } from '@/lib/constants'

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters').max(100, 'Location must be less than 100 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar_url: z.string().url('Invalid URL').optional()
})

export const skillSchema = z.object({
  name: z.string().min(2, 'Skill name must be at least 2 characters').max(50, 'Skill name must be less than 50 characters'),
  category: z.enum(SKILL_CATEGORIES as any, { required_error: 'Please select a category' }),
  description: z.string().max(200, 'Description must be less than 200 characters').optional()
})

export const userSkillSchema = z.object({
  skill_id: z.string().uuid('Invalid skill ID'),
  skill_type: z.enum(['offer', 'want'], { required_error: 'Please select skill type' }),
  proficiency_level: z.enum(PROFICIENCY_LEVELS as any, { required_error: 'Please select proficiency level' }),
  description: z.string().max(300, 'Description must be less than 300 characters').optional()
})

export const availabilitySchema = z.object({
  day_of_week: z.number().min(0).max(6, 'Invalid day of week'),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  timezone: z.string().min(1, 'Timezone is required')
})

export const swapRequestSchema = z.object({
  provider_id: z.string().uuid('Invalid provider ID'),
  requested_skill_id: z.string().uuid('Invalid skill ID'),
  offered_skill_id: z.string().uuid('Invalid skill ID'),
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
  scheduled_date: z.string().datetime().optional()
})

export const ratingSchema = z.object({
  swap_request_id: z.string().uuid('Invalid swap request ID'),
  rated_id: z.string().uuid('Invalid user ID'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  feedback: z.string().max(1000, 'Feedback must be less than 1000 characters').optional()
})

export const announcementSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters').max(1000, 'Content must be less than 1000 characters'),
  type: z.enum(ANNOUNCEMENT_TYPES as any, { required_error: 'Please select announcement type' }),
  expires_at: z.string().datetime().optional()
})