import { useEffect, useState } from 'react'
import { magic } from '@lib/magic'
import Feed from '@components/mvp/Feed'
import LoginHero from '@components/mvp/LoginHero'
import {
  auth,
  firestore,
  functions,
  GeoFirestore,
  GeoPoint,
  postsGeocollection,
  postToJSON,
  queryFirestore,
} from '@lib/firebase'
import { useStore } from '@lib/store'

const authRoute = process.env.NODE_ENV === 'production' ? 'auth' : 'authDev'

export default function HomePage() {
  const [userMetadata, setUserMetadata] = useState()
  const [authed, setAuthed] = useState(false)
  const twitterMetadata = useStore((s) => s.oauthdata)
  const [posts, setPosts] = useState<any>()

  useEffect(() => {
    if (!authed) return
    ;(async () => {
      // const geocollection = GeoFirestore.collectionGroup('posts')

      const postsQuery = postsGeocollection.near({
        center: new GeoPoint(40.7589, -73.9851),
        radius: 1000,
      })

      queryFirestore({ lat: 40.7589, lng: -73.9861 })

      // .limit(100)
      // .where('geolocation', '!=', null)
      // .orderBy('geolocation', 'desc')

      // const postsQuery = firestore
      //   .collectionGroup('posts')
      //   //
      //   // .where('geolocation', '!=', null)
      //   // .where('published', '==', true)
      //
      //   .limit(10)

      const posts = (await postsQuery.get()).docs.map(postToJSON)
      setPosts(posts)
    })()
  }, [authed])

  // useEffect(() => {
  //   console.log('userMetadata:', userMetadata)
  // }, [userMetadata])

  useEffect(() => {
    // On mount, we check if a user is logged in.
    // If so, we'll auth with Firebase the authenticated user's profile.
    magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
      if (magicIsLoggedIn) {
        magic.user.getMetadata().then(setUserMetadata)
        // console.log('Authing with Firebase...')
        const didToken = await magic.user.getIdToken()
        // console.log('didToken:', didToken)
        const authFunc = functions.httpsCallable(authRoute)
        /* DID token is passed into the auth callable function */
        let result = (await authFunc({ didToken, twitterMetadata })).data
        // console.log('result:', result)
        /* Firebase user access token is used to authenticate */
        const wat = await auth.signInWithCustomToken(result.token)
        // console.log('wat:', wat)
        setAuthed(true)
      }
    })
  }, [])

  return authed ? <Feed posts={posts} /> : <LoginHero />
}
