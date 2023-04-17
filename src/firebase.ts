import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_API_KEY as string,
  authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_REACT_APP_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_REACT_APP_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_REACT_APP_APP_ID as string,
  measurementId: import.meta.env.VITE_REACT_APP_MEASUREMENT_ID as string,
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
