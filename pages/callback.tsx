import { magic } from '@lib/magic'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useStore } from '@lib/store'

export default function Callback() {
  const router = useRouter()
  const setoauthdata = useStore((s) => s.setoauthdata)
  useEffect(() => {
    // On mount, we try to login with a Magic credential in the URL query.
    try {
      magic.oauth
        .getRedirectResult()
        .then((object) => {
          const info = {
            email: object.oauth.userInfo.email,
            emailVerified: object.oauth.userInfo.emailVerified,
            locale: object.oauth.userInfo.locale,
            name: object.oauth.userInfo.name,
            preferredUsername: object.oauth.userInfo.preferredUsername,
            profile: object.oauth.userInfo.profile,
            sub: object.oauth.userInfo.sub,
          }
          setoauthdata(info)
        })
        .finally(() => {
          router.push('/')
        })
    } catch (e) {
      console.log(e)
      router.push('/')
    }
  }, [])

  return <></>
}
