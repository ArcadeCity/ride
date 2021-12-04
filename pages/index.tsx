import { useEffect, useState } from 'react'
import { magic } from '@lib/magic'
import LoginHero from '@components/mvp/LoginHero'

export default function HomePage() {
  const [userMetadata, setUserMetadata] = useState()

  useEffect(() => {
    console.log('userMetadata:', userMetadata)
  }, [userMetadata])

  useEffect(() => {
    // On mount, we check if a user is logged in.
    // If so, we'll retrieve the authenticated user's profile.
    magic.user.isLoggedIn().then((magicIsLoggedIn) => {
      if (magicIsLoggedIn) {
        magic.user.getMetadata().then(setUserMetadata)
      }
    })
  }, [])

  return (
    <div
      className='flex h-screen w-screen justify-center items-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <LoginHero />
    </div>
  )
}
