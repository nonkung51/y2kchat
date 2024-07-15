// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWT0n1TUEuyQwknqpRTGu5Yj4c5iaTPSI",
  authDomain: "y2kchat.firebaseapp.com",
  projectId: "y2kchat",
  storageBucket: "y2kchat.appspot.com",
  messagingSenderId: "1068422107009",
  appId: "1:1068422107009:web:b57a36f16c974307f4a280",
  measurementId: "G-P3L6JRKWQE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);

export function initializeAuthListener() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      await addUserToFirestore(user);
    }
  });
}

async function addUserToFirestore(user) {
  try {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: user.displayName || '',
      createdAt: new Date(),
    }, { merge: true });
    console.log('User added to Firestore');
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
  }
}
