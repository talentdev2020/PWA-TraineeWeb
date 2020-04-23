import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAROiieEqDYmXXZQhaMf9ZEWeImtxMAJP0",
   authDomain: "tr-staging-8964c.firebaseapp.com",
   databaseURL: "https://tr-staging-8964c.firebaseio.com",
   projectId: "tr-staging-8964c",
   storageBucket: "tr-staging-8964c.appspot.com",
   messagingSenderId: "570768664029",
   appId: "1:570768664029:web:c36b545522039cbbc60234",
   measurementId: "G-ML4FQ5C07H"


  // apiKey: "AIzaSyAfgpHSZG9V3I_yX2ytGQzRX66HGLvL2m4",
  // authDomain: "tr-trainee-web-app.firebaseapp.com",
  // databaseURL: "https://tr-trainee-web-app.firebaseio.com",
  // projectId: "tr-trainee-web-app",
  // storageBucket: "",
  // messagingSenderId: "303700879955",
  // appId: "1:303700879955:web:435a2299bad8be639e74a6",
  // measurementId: "G-VT5Y8LCMF3"
  };

  if (!firebase.apps.length) {
    let app = firebase.initializeApp(firebaseConfig);

  }
  export const auth = firebase.auth();
  export const storage = firebase.storage();
  export const db = firebase.database();
  export const store = firebase.firestore();
