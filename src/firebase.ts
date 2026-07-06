import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  User,
  NextOrObserver,
  Unsubscribe,
  UserCredential
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// User's original Firebase configuration from the legacy codebase
const firebaseConfig = {
  apiKey: "AIzaSyA5oUYcBW3jQ7ZA1uZr2Ih4G9rJE6f8MGo",
  authDomain: "symphony-208f4.firebaseapp.com",
  projectId: "symphony-208f4",
  storageBucket: "symphony-208f4.appspot.com",
  messagingSenderId: "3707163930",
  appId: "1:3707163930:web:361863cd963df0f287c8a3",
  measurementId: "G-VBLNXB40D4"
};

let useMock = false;
let authInstance: any = null;
let firestoreInstance: any = null;

try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  authInstance = getAuth(app);
  firestoreInstance = getFirestore(app);
} catch (error) {
  console.warn("Firebase failed to load. Falling back to local demo mode authentication:", error);
  useMock = true;
}

// Mock User Implementation
class MockUser implements Partial<User> {
  uid: string;
  email: string;
  displayName: string;
  isAnonymous = false;
  emailVerified = true;
  metadata = {};
  providerData = [];

  constructor(uid: string, email: string, displayName?: string) {
    this.uid = uid;
    this.email = email;
    this.displayName = displayName || email.split('@')[0];
  }

  async getIdToken() {
    return "mock_token_" + this.uid;
  }
}

// Local mock data state
let currentUser: MockUser | null = null;
const authListeners: Set<(user: MockUser | null) => void> = new Set();

// Try loading session from localStorage
if (typeof window !== 'undefined') {
  const cached = localStorage.getItem('symphony_mock_user');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      currentUser = new MockUser(parsed.uid, parsed.email, parsed.displayName);
    } catch (_) {}
  }
}

const triggerListeners = () => {
  authListeners.forEach(listener => listener(currentUser));
};

// Mock Authentication Methods
const mockAuth = {
  currentUser: currentUser as any,
  onAuthStateChanged: (observer: NextOrObserver<User>): Unsubscribe => {
    const callback = typeof observer === 'function' ? observer : observer.next;
    if (callback) {
      // Direct call with current state
      setTimeout(() => callback(currentUser as any), 0);
      authListeners.add(callback as any);
    }
    return () => {
      if (callback) authListeners.delete(callback as any);
    };
  },
  signInWithEmailAndPassword: async (auth: any, email: string, psw: string): Promise<UserCredential> => {
    // Basic verification
    const users = JSON.parse(localStorage.getItem('symphony_mock_users') || '[]');
    const matched = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === psw);
    if (!matched) {
      throw new Error("Invalid email or password. Hint: Signup first!");
    }
    currentUser = new MockUser(matched.uid, matched.email, matched.displayName);
    localStorage.setItem('symphony_mock_user', JSON.stringify({
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName
    }));
    triggerListeners();
    return { user: currentUser as any } as any;
  },
  createUserWithEmailAndPassword: async (auth: any, email: string, psw: string): Promise<UserCredential> => {
    if (psw.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }
    const users = JSON.parse(localStorage.getItem('symphony_mock_users') || '[]');
    const exists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error("Email is already registered. Try logging in!");
    }
    const uid = 'usr_' + Math.random().toString(36).substring(2, 9);
    const newUser = { uid, email, password: psw, displayName: email.split('@')[0] };
    users.push(newUser);
    localStorage.setItem('symphony_mock_users', JSON.stringify(users));

    currentUser = new MockUser(uid, email);
    localStorage.setItem('symphony_mock_user', JSON.stringify({
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName
    }));
    triggerListeners();
    return { user: currentUser as any } as any;
  },
  signOut: async (auth: any): Promise<void> => {
    currentUser = null;
    localStorage.removeItem('symphony_mock_user');
    triggerListeners();
  },
  updateProfile: async (user: any, profile: { displayName?: string }): Promise<void> => {
    if (currentUser) {
      if (profile.displayName) currentUser.displayName = profile.displayName;
      localStorage.setItem('symphony_mock_user', JSON.stringify({
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName
      }));
      triggerListeners();
    }
  }
};

// Export actual or mock auth functions depending on failsafe checks
export const auth = useMock ? (mockAuth as any) : authInstance;
export const db = firestoreInstance;

export const safeOnAuthStateChanged = (callback: (user: any) => void): Unsubscribe => {
  if (useMock) {
    return mockAuth.onAuthStateChanged(callback as any);
  } else {
    return onAuthStateChanged(auth, callback);
  }
};

export const safeSignIn = async (email: string, psw: string): Promise<any> => {
  if (useMock) {
    return mockAuth.signInWithEmailAndPassword(null, email, psw);
  } else {
    return signInWithEmailAndPassword(auth, email, psw);
  }
};

export const safeSignUp = async (email: string, psw: string): Promise<any> => {
  if (useMock) {
    return mockAuth.createUserWithEmailAndPassword(null, email, psw);
  } else {
    return createUserWithEmailAndPassword(auth, email, psw);
  }
};

export const safeSignOut = async (): Promise<void> => {
  if (useMock) {
    return mockAuth.signOut(null);
  } else {
    return signOut(auth);
  }
};

export const safeUpdateProfile = async (displayName: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) return;
  if (useMock) {
    return mockAuth.updateProfile(user, { displayName });
  } else {
    return updateProfile(user, { displayName });
  }
};
