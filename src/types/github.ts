import { z } from 'zod';

export const GitHubUserSchema = z.object({
  login: z.string().min(1),
  name: z.string().nullable(),
  avatar_url: z.string().url(),
  bio: z.string().nullable(),
  followers: z.number().int().nonnegative(),
  following: z.number().int().nonnegative(),
  public_repos: z.number().int().nonnegative(),
  html_url: z.string().url(),
});

export type GitHubUser = z.infer<typeof GitHubUserSchema>;

export interface ApiError {
  type: 'not_found' | 'rate_limit' | 'network' | 'validation' | 'unknown';
  message: string;
  statusCode?: number;
}
