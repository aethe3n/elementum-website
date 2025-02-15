import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

export type AuthResponse = {
  user?: User;
  error?: string;
};

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user };
    } catch (error: any) {
      console.error('Login Error:', error);
      return { error: this.getErrorMessage(error.code) };
    }
  }

  async register(email: string, password: string): Promise<AuthResponse> {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send email verification
      if (result.user) {
        try {
          await sendEmailVerification(result.user);
        } catch (verificationError) {
          console.warn('Email verification sending failed:', verificationError);
          // Continue with registration even if verification email fails
        }
      }
      
      return { user: result.user };
    } catch (error: any) {
      console.error('Registration Error:', error);
      return { error: this.getErrorMessage(error.code) };
    }
  }

  async googleSignIn(): Promise<AuthResponse> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      console.log('Setting up persistence...');
      await setPersistence(auth, browserLocalPersistence);
      console.log('Persistence set up, initiating Google sign in...');
      
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign in successful');
      return { user: result.user };
    } catch (error: any) {
      console.error('Google Sign In Error:', {
        code: error.code,
        message: error.message,
        email: error.email,
        credential: error.credential
      });
      
      // Check for specific error conditions
      if (error.code === 'auth/configuration-not-found') {
        console.error('Firebase configuration error - check API key and auth domain');
      }
      
      if (error.code === 'auth/api-key-expired') {
        console.error('API key has expired - needs to be renewed in Firebase Console');
      }
      
      return { error: this.getErrorMessage(error.code) };
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout Error:', error);
      throw new Error('Failed to sign out. Please try again.');
    }
  }

  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      await sendPasswordResetEmail(auth, email);
      return {};
    } catch (error: any) {
      console.error('Reset Password Error:', error);
      return { error: this.getErrorMessage(error.code) };
    }
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email === email) {
      try {
        await sendEmailVerification(currentUser);
      } catch (error) {
        console.error('Email verification sending failed:', error);
        throw error;
      }
    }
  }

  async checkEmailVerified(): Promise<boolean> {
    const user = auth.currentUser;
    if (user) {
      // Reload user to get latest status
      await user.reload();
      return user.emailVerified;
    }
    return false;
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/popup-closed-by-user':
        return 'Sign in was cancelled.';
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled. Please contact support.';
      case 'auth/internal-error':
        return 'An internal error occurred. Please try again.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}

export const authService = new AuthService(); 