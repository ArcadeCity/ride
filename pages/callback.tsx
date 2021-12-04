import { magic } from '@lib/magic'
import React, { useEffect } from 'react'

export default function Callback() {
  useEffect(() => {
    // On mount, we try to login with a Magic credential in the URL query.
    magic.oauth.getRedirectResult().finally(() => {
      console.log('redirect done, now what?')
      // history.push("/")
    })
  }, [])

  return <></>
}
