import { auth, isUsingMock } from './firebase';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	updateProfile
} from 'firebase/auth';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

// Helper to manage mock users in localStorage
function getMockUsers() {
	if (typeof window === 'undefined') return [];
	const data = localStorage.getItem('mock_users');
	if (!data) {
		const defaultUsers = [
			{
				uid: 'mock-uid-admin',
				name: 'System Administrator',
				email: 'admin@mobile.com',
				password: 'admin123',
				role: 'admin',
				createdAt: new Date().toISOString()
			},
			{
				uid: 'mock-uid-customer',
				name: 'Jane Doe',
				email: 'customer@mobile.com',
				password: 'customer123',
				role: 'customer',
				createdAt: new Date().toISOString()
			}
		];
		localStorage.setItem('mock_users', JSON.stringify(defaultUsers));
		return defaultUsers;
	}
	return JSON.parse(data);
}

function saveMockUser(user) {
	const users = getMockUsers();
	users.push(user);
	localStorage.setItem('mock_users', JSON.stringify(users));
}

// Global listeners list for Mock Auth changes
let mockAuthListeners = [];

// Get logged-in user in mock mode
export function getMockCurrentUser() {
	if (typeof window === 'undefined') return null;
	const data = localStorage.getItem('mock_current_user');
	return data ? JSON.parse(data) : null;
}

// Set logged-in user in mock mode and broadcast
function setMockCurrentUser(user) {
	if (typeof window === 'undefined') return;
	if (user) {
		localStorage.setItem('mock_current_user', JSON.stringify(user));
	} else {
		localStorage.removeItem('mock_current_user');
	}
	mockAuthListeners.forEach((cb) => cb(user));
}

/**
 * Register a new user
 */
export async function registerUser(email, password, name, role = 'customer') {
	if (isUsingMock) {
		const users = getMockUsers();
		if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
			throw new Error('Email already in use.');
		}
		const newUser = {
			uid: 'mock-uid-' + Math.random().toString(36).substr(2, 9),
			name,
			email,
			password, // Stored in plain text only for mock environment
			role,
			createdAt: new Date().toISOString()
		};
		saveMockUser(newUser);
		const sessionUser = {
			uid: newUser.uid,
			email: newUser.email,
			name: newUser.name,
			role: newUser.role
		};
		setMockCurrentUser(sessionUser);
		return sessionUser;
	} else {
		// Real Firebase Auth
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		await updateProfile(user, { displayName: name });

		// Create user record in Firestore
		const userDoc = {
			uid: user.uid,
			name,
			email,
			role,
			createdAt: new Date().toISOString()
		};
		await setDoc(doc(db, 'users', user.uid), userDoc);
		return userDoc;
	}
}

/**
 * Login user
 */
export async function loginUser(email, password) {
	if (isUsingMock) {
		const users = getMockUsers();
		const user = users.find(
			(u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
		);
		if (!user) {
			throw new Error('Invalid email or password.');
		}
		const sessionUser = { uid: user.uid, email: user.email, name: user.name, role: user.role };
		setMockCurrentUser(sessionUser);
		return sessionUser;
	} else {
		// Real Firebase Auth
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		// Fetch role from Firestore
		const userDocRef = doc(db, 'users', user.uid);
		const userDocSnap = await getDoc(userDocRef);
		if (userDocSnap.exists()) {
			return userDocSnap.data();
		} else {
			// Create a default customer profile if firestore record is missing
			const fallbackDoc = {
				uid: user.uid,
				name: user.displayName || 'User',
				email: user.email,
				role: 'customer',
				createdAt: new Date().toISOString()
			};
			await setDoc(userDocRef, fallbackDoc);
			return fallbackDoc;
		}
	}
}

/**
 * Logout current user
 */
export async function logoutUser() {
	if (isUsingMock) {
		setMockCurrentUser(null);
		return true;
	} else {
		await signOut(auth);
		return true;
	}
}

/**
 * Listen to auth state changes
 */
export function onAuthChanged(callback) {
	if (isUsingMock) {
		mockAuthListeners.push(callback);
		// Call immediately with current state
		const currentUser = getMockCurrentUser();
		callback(currentUser);
		// Return unsubscriber function
		return () => {
			mockAuthListeners = mockAuthListeners.filter((cb) => cb !== callback);
		};
	} else {
		return onAuthStateChanged(auth, async (user) => {
			if (user) {
				const userDocRef = doc(db, 'users', user.uid);
				const userDocSnap = await getDoc(userDocRef);
				if (userDocSnap.exists()) {
					callback(userDocSnap.data());
				} else {
					callback({
						uid: user.uid,
						name: user.displayName || 'User',
						email: user.email,
						role: 'customer'
					});
				}
			} else {
				callback(null);
			}
		});
	}
}
