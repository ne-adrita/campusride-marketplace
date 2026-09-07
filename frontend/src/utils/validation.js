import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .refine((val) => val.trim().toLowerCase().endsWith('@northsouth.edu'), {
      message: 'You must use a valid @northsouth.edu email address',
    }),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .refine((val) => val.trim().toLowerCase().endsWith('@northsouth.edu'), {
      message: 'You must use a valid @northsouth.edu email address',
    }),
  studentId: z.string().min(1, 'Student ID is required'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const createListingSchema = z.object({
  title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Price must be greater than 0'),
  condition: z.string().optional(),
  category_id: z.string().min(1, 'Please select a category'),
  location: z.string().optional(),
});

export const createRideSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  date_time: z.string().min(1, 'Date & time is required').refine((val) => {
    const d = new Date(val);
    return d > new Date();
  }, { message: 'Date & time must be in the future' }),
  seats_total: z.coerce.number().int('Seats must be a whole number').min(1, 'At least 1 seat required'),
  fare_per_seat: z.coerce.number().min(0, 'Fare cannot be negative'),
  vehicle_details: z.string().optional(),
});

export const settingsSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});