import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'
import * as geofirestore from 'geofirestore'
import { RootStore } from './mst'
import { useStore } from './store'

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

// Auth exports
export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
export const twitterAuthProvider = new firebase.auth.TwitterAuthProvider()

export const functions = firebase.functions()

// Firestore exports
export const firestore = firebase.firestore()
export const GeoPoint = firebase.firestore.GeoPoint
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
export const fromMillis = firebase.firestore.Timestamp.fromMillis
export const increment = firebase.firestore.FieldValue.increment
export const GeoFirestore = geofirestore.initializeApp(firestore)
export const postsGeocollection = GeoFirestore.collectionGroup('posts')

// Storage exports
export const storage = firebase.storage()
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED

/// Helper functions

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users')
  const query = usersRef.where('username', '==', username).limit(1)
  const userDoc = (await query.get()).docs[0]
  return userDoc
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data()
  return {
    ...data,
    id: doc.id,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    // createdAt: data?.createdAt.toMillis() || 0,
    createdAt: data?.createdAt.toMillis() || 0,
  }
}

// Query viewers' locations from Firestore
let subscription
export function queryFirestore(location: any, store: RootStore) {
  console.log('Querying geofirestore...')
  if (subscription) {
    console.log('Old query subscription cancelled')
    subscription()
    subscription = false
  }

  const geoCollectionRef = postsGeocollection
  const radius = 1500
  const query = geoCollectionRef.near({
    center: new firebase.firestore.GeoPoint(location.lat, location.lng),
    radius,
  })

  console.log('New query subscription created')
  subscription = query.onSnapshot((snapshot) => {
    // console.log(snapshot.docChanges())
    snapshot.docChanges().forEach((change) => {
      switch (change.type) {
        case 'added':
          const data = change.doc.data()
          // console.log(data)
          store.addPost({
            id: change.doc.id,
            twitterMetadata: data.twitterMetadata,
            createdAt: data?.createdAt?.toMillis() || Date.now(),
            // updatedAt: data?.updatedAt?.toMillis() || Date.now(),
            geolocation: data.geolocation,
            content: data.content,
          })
          // useStore.getState().add({
          //   id: change.doc.id,
          //   ...change.doc.data(),
          //   updatedAt: Date.now(),
          // })
          // console.log('Snapshot detected added')
          return //addMarker(change.doc.id, change.doc.data());
        case 'modified':
          // console.log('Snapshot detected modified')
          // const data2 = change.doc.data()
          // console.log('data2?', data2)
          // store.addPost({
          //   id: change.doc.id,
          //   twitterMetadata: data2.twitterMetadata,
          //   updatedAt: Date.now(),
          //   geolocation: data2.geolocation,
          //   content: data2.content,
          // })
          return //updateMarker(change.doc.id, change.doc.data());
        case 'removed':
          console.log('Snapshot detected removed ')
          return //removeMarker(change.doc.id, change.doc.data());
        default:
          break
      }
    })
  })
}
