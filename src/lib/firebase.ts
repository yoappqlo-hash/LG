import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  getDocFromServer,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { ServerNode, AnnouncementItem, SystemConfig, AdminUser } from '../types/server';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with configured database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is currently offline or connecting.');
    }
  }
}
testFirestoreConnection();

// Sign In with Google
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Google Sign In failed:', err);
    throw err;
  }
}

// Sign Out
export async function signOutFirebase(): Promise<void> {
  await signOut(auth);
}

// User Profile sync to Firestore
export async function syncUserProfile(user: User, designatedRole?: AdminUser['role']) {
  const userPath = `users/${user.uid}`;
  const isSuperAdminEmail = user.email === 'yoappqlo@gmail.com';
  const role: AdminUser['role'] = isSuperAdminEmail
    ? 'Root Super Admin'
    : designatedRole || 'DevOps Lead';

  const roleAr =
    role === 'Root Super Admin'
      ? 'المشرف العام (Root)'
      : role === 'DevOps Lead'
      ? 'مدير العمليات DevOps'
      : 'مدقق الأمان';

  const profileData = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || 'Google Operator',
    photoURL: user.photoURL || '',
    role,
    roleAr,
    twoFactorEnabled: true,
    status: 'active',
    lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
    // If admin, also populate admins whitelist collection
    if (isSuperAdminEmail || role === 'Root Super Admin') {
      await setDoc(doc(db, 'admins', user.uid), {
        email: user.email,
        role: 'Root Super Admin',
        grantedAt: new Date().toISOString(),
      }, { merge: true });
    }
  } catch (error) {
    console.warn('Profile sync note:', error);
  }

  return profileData;
}
