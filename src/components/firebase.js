import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get the Firebase Authentication instance
export const auth = firebase.auth();

// Create a Google Authentication provider
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await auth.signInWithPopup(googleAuthProvider);
    // Handle successful sign-in
    console.log('Google Sign-In successful:', result.user);
  } catch (error) {
    // Handle sign-in error
    console.error('Google Sign-In error:', error);
  }
};

// Sign up with email and password
export const signUpWithEmailAndPassword = async (email, password) => {
  try {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    // Handle successful sign-up
    console.log('Sign-up successful:', result.user);
  } catch (error) {
    // Handle sign-up error
    console.error('Sign-up error:', error);
  }
};

// Sign in with email and password
export const signInWithEmailAndPassword = async (email, password) => {
  try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    // Handle successful sign-in
    console.log('Sign-in successful:', result.user);
  } catch (error) {
    // Handle sign-in error
    console.error('Sign-in error:', error);
  }
};

// Sign out
export const signOut = async () => {
  try {
    await auth.signOut();
    // Handle successful sign-out
    console.log('Sign-out successful');
  } catch (error) {
    // Handle sign-out error
    console.error('Sign-out error:', error);
  }
};