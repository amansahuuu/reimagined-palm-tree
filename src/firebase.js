import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// PASTE YOUR CONFIG HERE (from step 3.3)
// Import the functions you need from the SDKs you need

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLYcPr8GZHAn8pFfZyuXltHyKdejxIsbI",
  authDomain: "dailychores-1d580.firebaseapp.com",
  projectId: "dailychores-1d580",
  storageBucket: "dailychores-1d580.firebasestorage.app",
  messagingSenderId: "1079521777669",
  appId: "1:1079521777669:web:e9ba801f3c023ac26e246c",
  measurementId: "G-C5XSJLJJHT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// USER ID (for now, hardcode this - later we'll add auth)
const USER_ID = "user_001"; // Change this to your name or whatever

// ==================== DATABASE FUNCTIONS ====================

// Save user data
export async function saveUserData(userData) {
  try {
    await setDoc(doc(db, 'users', USER_ID), {
      ...userData,
      lastUpdated: new Date().toISOString()
    });
    console.log('User data saved!');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

// Load user data
export async function loadUserData() {
  try {
    const docRef = doc(db, 'users', USER_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Return default data if user doesn't exist yet
      return {
        level: 1,
        currentXP: 0,
        streak: 0,
        longestStreak: 0,
        totalXPEarned: 0,
        totalXPSpent: 0
      };
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
}

// Save today's data
export async function saveTodayData(todayData) {
  const today = new Date().toISOString().split('T')[0]; // Format: 2025-10-29
  
  try {
    await setDoc(doc(db, 'users', USER_ID, 'dailyLogs', today), {
      ...todayData,
      date: today,
      timestamp: new Date().toISOString()
    });
    console.log('Today data saved!');
  } catch (error) {
    console.error('Error saving today data:', error);
  }
}

// Load today's data
export async function loadTodayData() {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const docRef = doc(db, 'users', USER_ID, 'dailyLogs', today);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return {
        workout: { completed: false, type: 'push', rounds: 0, exercises: [] },
        nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, meals: [] },
        habits: {},
        waterIntake: 0
      };
    }
  } catch (error) {
    console.error('Error loading today data:', error);
    return null;
  }
}

// Save purchase
export async function savePurchase(purchase) {
  try {
    await addDoc(collection(db, 'users', USER_ID, 'purchases'), {
      ...purchase,
      timestamp: new Date().toISOString()
    });
    console.log('Purchase saved!');
  } catch (error) {
    console.error('Error saving purchase:', error);
  }
}

// Upload photo (for penalty proofs)
export async function uploadPhoto(file) {
  try {
    const storageRef = ref(storage, `penalties/${USER_ID}/${Date.now()}.jpg`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error uploading photo:', error);
    return null;
  }
}

export { db, storage, USER_ID };