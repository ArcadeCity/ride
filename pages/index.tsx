import { useEffect, useState } from 'react'
import { magic } from '@lib/magic'
import Feed from '@components/mvp/Feed'
import LoginHero from '@components/mvp/LoginHero'
import { auth, functions, queryFirestore } from '@lib/firebase'
import { useStore } from '@lib/store'
import { useStores } from '@lib/root-store-context'
import { observer } from 'mobx-react-lite'

const authRoute = process.env.NODE_ENV === 'production' ? 'auth' : 'authDev'

function HomePage() {
  const [authed, setAuthed] = useState(false)
  const user = useStores().user
  const posts = useStores().posts
  const twitterMetadata = useStore((s) => s.oauthdata)
  const store = useStores()
  const lat = useStores().coords?.lat
  const lng = useStores().coords?.lng
  const showFeed = useStores().showFeed

  useEffect(() => {
    if (!authed || !lat || !lng) return
    queryFirestore({ lat, lng }, store)
  }, [authed, lat, lng])

  useEffect(() => {
    // On mount, we check if a user is logged in.
    // If so, we'll auth with Firebase the authenticated user's profile.
    magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
      if (magicIsLoggedIn) {
        const didToken = await magic.user.getIdToken()
        const authFunc = functions.httpsCallable(authRoute)
        /* DID token is passed into the auth callable function */
        let result = (await authFunc({ didToken, twitterMetadata })).data
        /* Firebase user access token is used to authenticate */
        await auth.signInWithCustomToken(result.token)
        setAuthed(true)
      }
    })
  }, [])

  // still need to handle no posts
  return showFeed ? <Feed /> : <LoginHero />
}

export default observer(HomePage)
