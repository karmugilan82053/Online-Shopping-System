import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
	authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.PUBLIC_FIREBASE_APP_ID
};

// Check if we have valid-looking firebase config keys
const hasRealFirebase =
	firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your-api-key' && firebaseConfig.projectId;

let app;
let auth;
let db;
let storage;
let isUsingMock = true;

if (hasRealFirebase) {
	try {
		app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
		auth = getAuth(app);
		db = getFirestore(app);
		storage = getStorage(app);
		isUsingMock = false;
		console.log('Firebase initialized successfully in Real Database Mode.');
	} catch (error) {
		console.error('Firebase initialization failed, falling back to Mock Mode:', error);
	}
} else {
	console.log('No Firebase configuration detected. Running in browser Mock Mode.');
}

export { auth, db, storage, isUsingMock };
