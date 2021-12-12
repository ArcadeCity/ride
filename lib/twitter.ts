import { useCallback } from 'react'
import { magic } from '@lib/magic'

export const signInWithTwitter = async () => {
  // setIsLoggingIn(true)
  try {
    await magic.oauth.loginWithRedirect({
      provider: 'twitter',
      redirectURI: new URL('/callback', window.location.origin).href,
    })
    // history.push("/");
  } catch (e) {
    console.log('failed:', e)
    // setIsLoggingIn(false)
  }
}
