import { getAuth, updateProfile as updateFirebaseProfile, updateEmail as updateFirebaseEmail } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

interface ProfileUpdate {
  name?: string
  email?: string
}

export async function updateProfile(userId: string, update: ProfileUpdate) {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('No user is currently signed in')
  }

  // Update display name in Firebase Auth
  if (update.name) {
    await updateFirebaseProfile(user, {
      displayName: update.name
    })
  }

  // Update email in Firebase Auth
  if (update.email && update.email !== user.email) {
    await updateFirebaseEmail(user, update.email)
  }

  // Update user document in Firestore
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, {
    name: update.name,
    email: update.email,
    updatedAt: new Date().toISOString()
  })
} 