import { z } from 'zod';

const announcementSchema = z.object({
  id: z.string().uuid(), // UUID string
  title: z.string().min(1), // non-empty string
  content: z.string().min(1), // non-empty string
  created_at: z.string(),
  author: z.string().min(1), // non-empty string
  is_active: z.boolean(), // boolean, defaults to true
});

export type Announcement = z.infer<typeof announcementSchema>;
