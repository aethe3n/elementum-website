export interface User {
  id: string
  name?: string
  email: string
  plan: 'basic' | 'premium'
  createdAt: string | Date
  lastLogin: string | Date
} 