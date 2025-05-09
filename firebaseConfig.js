import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
//import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.FIRESTORE_API_KEY,
    authDomain: process.env.FIRESTORE_AUTH_DOMAIN,
    databaseURL: process.env.FIRESTORE_DATABASE_URL,
    projectId: process.env.FIRESTORE_PROJECT_ID,
    storageBucket: process.env.FIRESTORE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIRESTORE_MESSAGING_SENDER_ID,
    appId: process.env.FIRESTORE_APP_ID
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

// Initialize Cloud Firestore and get a reference to the service
const FirebaseDb = getFirestore(app)

export { FirebaseDb };


