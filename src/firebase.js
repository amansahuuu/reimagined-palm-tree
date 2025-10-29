import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  getDocs,
  updateDoc 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';

// REPLACE WITH YOUR CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyBLYcPr8GZHAn8pFfZyuXltHyKdejxIsbI",
  authDomain: "dailychores-1d580.firebaseapp.com",
  projectId: "dailychores-1d580",
  storageBucket: "dailychores-1d580.firebasestorage.app",
  messagingSenderId: "1079521777669",
  appId: "1:1079521777669:web:e9ba801f3c023ac26e246c",
  measurementId: "G-C5XSJLJJHT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const USER_ID = "user123";

// ==================== USER DATA ====================

export async function saveUserData(userData) {
  try {
    await setDoc(doc(db, 'users', USER_ID), {
      ...userData,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

export async function loadUserData() {
  try {
    const docRef = doc(db, 'users', USER_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
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

// ==================== DAILY LOGS ====================

export async function saveTodayData(todayData) {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    await setDoc(doc(db, 'users', USER_ID, 'dailyLogs', today), {
      ...todayData,
      date: today,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving today data:', error);
  }
}

export async function loadTodayData() {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const docRef = doc(db, 'users', USER_ID, 'dailyLogs', today);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return {
        workout: { completed: false, day: 1, exercises: [], photoURL: null },
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

// ==================== PURCHASE HISTORY ====================

export async function savePurchase(purchase) {
  try {
    await addDoc(collection(db, 'users', USER_ID, 'purchases'), {
      ...purchase,
      timestamp: new Date().toISOString(),
      userId: USER_ID
    });
    console.log('Purchase saved to Firebase!');
  } catch (error) {
    console.error('Error saving purchase:', error);
  }
}

export async function loadPurchaseHistory() {
  try {
    const q = query(
      collection(db, 'users', USER_ID, 'purchases'),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const purchases = [];
    querySnapshot.forEach((doc) => {
      purchases.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('Loaded purchase history:', purchases);
    return purchases;
  } catch (error) {
    console.error('Error loading purchase history:', error);
    return [];
  }
}

export async function getLastPurchaseDate(productName) {
  try {
    const q = query(
      collection(db, 'users', USER_ID, 'purchases'),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    for (const doc of querySnapshot.docs) {
      const purchase = doc.data();
      const hasProduct = purchase.items.some(item => item.name === productName);
      if (hasProduct) {
        return purchase.timestamp;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting last purchase:', error);
    return null;
  }
}

// ==================== IMAGE UPLOAD ====================

export async function uploadWorkoutPhoto(file) {
  try {
    const timestamp = Date.now();
    const storageRef = ref(storage, `workouts/${USER_ID}/${timestamp}.jpg`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    console.log('Workout photo uploaded:', url);
    return url;
  } catch (error) {
    console.error('Error uploading workout photo:', error);
    return null;
  }
}

export async function uploadPurchasePhoto(file) {
  try {
    const timestamp = Date.now();
    const storageRef = ref(storage, `purchases/${USER_ID}/${timestamp}.jpg`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    console.log('Purchase photo uploaded:', url);
    return url;
  } catch (error) {
    console.error('Error uploading purchase photo:', error);
    return null;
  }
}

export async function uploadPenaltyPhoto(file) {
  try {
    const timestamp = Date.now();
    const storageRef = ref(storage, `penalties/${USER_ID}/${timestamp}.jpg`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    console.log('Penalty photo uploaded:', url);
    return url;
  } catch (error) {
    console.error('Error uploading penalty photo:', error);
    return null;
  }
}

// ==================== WORKOUT HISTORY ====================

export async function saveWorkoutCompletion(workoutData) {
  try {
    await addDoc(collection(db, 'users', USER_ID, 'workoutHistory'), {
      ...workoutData,
      timestamp: new Date().toISOString(),
      userId: USER_ID
    });
    console.log('Workout history saved!');
  } catch (error) {
    console.error('Error saving workout history:', error);
  }
}

export async function loadWorkoutHistory() {
  try {
    const q = query(
      collection(db, 'users', USER_ID, 'workoutHistory'),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const workouts = [];
    querySnapshot.forEach((doc) => {
      workouts.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('Loaded workout history:', workouts.length, 'workouts');
    return workouts;
  } catch (error) {
    console.error('Error loading workout history:', error);
    return [];
  }
}

export { db, storage, USER_ID };