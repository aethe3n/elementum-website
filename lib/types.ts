export interface AppUser {
  id: string
  name?: string
  email: string
  plan: 'basic' | 'premium'
  createdAt: string
  lastLogin: string
}

// Add any other types needed for the application here 