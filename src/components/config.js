import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBlS1cm_8v1WTj0C1QR2ypUgnk1erEcgIo",
    authDomain: "test-b2b2e.firebaseapp.com",
    projectId: "test-b2b2e",
    storageBucket: "test-b2b2e.appspot.com",
    messagingSenderId: "989453497395",
    appId: "1:989453497395:web:dbbba95af5dd1796ac1f46",
    measurementId: "G-DVK5LQ16FE"
};

if(!firebase.apps.length)
{
    firebase.initializeApp(firebaseConfig);
}

export {firebase};