import firebase from "firebase";



const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDMKWTGsCl-7yN3xk6Dievtd2_HFtnLnNU",
    authDomain: "instagram-2204d.firebaseapp.com",
    projectId: "instagram-2204d",
    storageBucket: "instagram-2204d.appspot.com",
    messagingSenderId: "464049775999",
    appId: "1:464049775999:web:b51f7912a80884b3d5a64a",
    measurementId: "G-QXRG617R20"

});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();



export { db, auth, storage, };