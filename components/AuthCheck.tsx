import Link from 'next/link'
import { useContext, useEffect } from 'react'
import { UserContext } from '@lib/context'

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
  const { user, username } = useContext(UserContext)

  useEffect(() => {
    if (!user) return
    console.log(user.displayName)
    console.log(user.photoURL)
    console.log(user.uid)
    console.log(user.providerData[0].uid)
  }, [user])

  return username
    ? props.children
    : props.fallback || <Link href='/enter'>You must be signed in</Link>
}
