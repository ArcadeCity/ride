import { useEffect, useState } from 'react'
import { magic } from '@lib/magic'
import Feed from '@components/mvp/Feed'
import LoginHero from '@components/mvp/LoginHero'

export default function HomePage() {
  const [userMetadata, setUserMetadata] = useState()
  const [authed, setAuthed] = useState(true)

  useEffect(() => {
    console.log('userMetadata:', userMetadata)
  }, [userMetadata])

  useEffect(() => {
    // On mount, we check if a user is logged in.
    // If so, we'll retrieve the authenticated user's profile.
    magic.user.isLoggedIn().then((magicIsLoggedIn) => {
      if (magicIsLoggedIn) {
        magic.user.getMetadata().then(setUserMetadata)
        setAuthed(true)
      }
    })
  }, [])

  return authed ? <Feed /> : <LoginHero />
}
