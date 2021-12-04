import { magic } from '@lib/magic'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Callback() {
  const router = useRouter()
  useEffect(() => {
    // On mount, we try to login with a Magic credential in the URL query.
    try {
      magic.oauth
        .getRedirectResult()
        .then((object) => {
          console.log('first, the object:', object)
        })
        .finally(() => {
          console.log('Redirected from Magic, on to the homepage...')
          // router.push('/')
        })
    } catch (e) {
      console.log(e)
      router.push('/')
    }
  }, [])

  return <></>
}
