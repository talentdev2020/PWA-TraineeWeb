import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/storage'

const config = {
  apiKey: 'AIzaSyAROiieEqDYmXXZQhaMf9ZEWeImtxMAJP0',
  authDomain: 'tr-staging-8964c.firebaseapp.com',
  databaseURL: 'https://tr-staging-8964c.firebaseio.com',
  projectId: 'tr-staging-8964c',
  storageBucket: 'tr-staging-8964c.appspot.com',
  messagingSenderId: '570768664029',
  appId: '1:570768664029:web:63bb8dce0eadc26ac60234',
  measurementId: 'G-CW5CWL832M'
}

// eslint-disable-next-line no-unused-expressions
!firebase.apps.length ? firebase.initializeApp(config) : ''
export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const DB = firebase.database()
export const CloudStore = firebase.firestore()
export const Storage = firebase.storage()
export const firebaseApp = firebase
