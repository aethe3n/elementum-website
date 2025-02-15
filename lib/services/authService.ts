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
  debug?: Record<string, any>;
};

class AuthService {
  private async ensureAuthPersistence() {
    try {
      await setPersistence(auth, browserLocalPersistence);
      console.log('Auth persistence confirmed');
    } catch (error) {
      console.error('Persistence setup failed:', error);
      // Continue without persistence rather than failing
    }
  }

  private getAuthDebugInfo() {
    return {
      domain: typeof window !== 'undefined' ? window.location.hostname : 'server',
      authInitialized: !!auth,
      currentUser: auth.currentUser ? {
        uid: auth.currentUser.uid,
        emailVerified: auth.currentUser.emailVerified,
        provider: auth.currentUser.providerData[0]?.providerId
      } : null,
      config: {
        authDomain: auth.app.options.authDomain,
        apiKeyPresent: !!auth.app.options.apiKey
      }
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const debugInfo = this.getAuthDebugInfo();
    console.log('Login Attempt Debug:', debugInfo);

    try {
      await this.ensureAuthPersistence();
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, debug: debugInfo };
    } catch (error: any) {
      console.error('Login Error:', { error, debugInfo });
      return { 
        error: this.getErrorMessage(error.code), 
        debug: { ...debugInfo, errorCode: error.code, errorMessage: error.message } 
      };
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
    const debugInfo = this.getAuthDebugInfo();
    console.log('Google Sign In Attempt Debug:', debugInfo);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
      // Add hosted domain if on production
      ...(debugInfo.domain === 'www.elementumglobal.com' && {
        hosted_domain: 'elementumglobal.com'
      })
    });
    
    try {
      await this.ensureAuthPersistence();
      
      console.log('Initiating Google sign in...');
      const result = await signInWithPopup(auth, provider);
      
      console.log('Google sign in successful:', {
        user: {
          uid: result.user.uid,
          email: result.user.email,
          provider: result.user.providerData[0]?.providerId
        }
      });
      
      return { user: result.user, debug: debugInfo };
    } catch (error: any) {
      // Enhanced error logging
      const errorDetails = {
        code: error.code,
        message: error.message,
        email: error.email,
        credential: error.credential,
        stack: error.stack,
        debugInfo
      };
      
      console.error('Google Sign In Error:', errorDetails);
      
      // Special handling for common errors
      if (error.code === 'auth/popup-blocked') {
        return { 
          error: 'The sign in popup was blocked. Please allow popups for this site.',
          debug: errorDetails
        };
      }
      
      if (error.code === 'auth/popup-closed-by-user') {
        return { 
          error: 'The sign in was cancelled. Please try again.',
          debug: errorDetails
        };
      }
      
      return { 
        error: this.getErrorMessage(error.code), 
        debug: errorDetails
      };
    }
  }

  async logout(): Promise<void> {
    const debugInfo = this.getAuthDebugInfo();
    console.log('Logout Attempt Debug:', debugInfo);

    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout Error:', { error, debugInfo });
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
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/network-request-failed': 'Network error. Please check your internet connection.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/popup-closed-by-user': 'Sign in was cancelled.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
      'auth/internal-error': 'An internal error occurred. Please try again.',
      'auth/api-key-expired': 'Authentication is temporarily unavailable. Please try again in a few minutes.',
      'auth/invalid-api-key': 'Authentication is temporarily unavailable. Please try again in a few minutes.',
      'auth/app-deleted': 'Authentication is temporarily unavailable. Please refresh the page.',
      'auth/app-not-authorized': 'Authentication is temporarily unavailable. Please try again later.',
      'auth/argument-error': 'Invalid authentication attempt. Please try again.',
      'auth/invalid-user-token': 'Your session has expired. Please sign in again.',
      'auth/web-storage-unsupported': 'Please enable cookies in your browser settings.',
      'auth/unauthorized-domain': 'This domain is not authorized for authentication. Please use www.elementumglobal.com',
    };

    return errorMessages[code] || 'An unexpected error occurred. Please try again.';
  }
}

export const authService = new AuthService(); 