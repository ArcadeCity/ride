import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBP3Brn_pj__JTFDGEIHacPS8ka3w-mtK4',
  authDomain: 'acride.firebaseapp.com',
  projectId: 'acride',
  storageBucket: 'acride.appspot.com',
  messagingSenderId: '538870781117',
  appId: '1:538870781117:web:2649ce057634add30753d4',
  measurementId: 'G-1YXRSX8VJS',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export const firestore = firebase.firestore()
export const storage = firebase.storage()
