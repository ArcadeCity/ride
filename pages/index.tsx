import PostFeed from '@components/PostFeed'
import Metatags from '@components/Metatags'
import Loader from '@components/Loader'
import { auth, firestore, fromMillis, postToJSON, twitterAuthProvider } from '@lib/firebase'
import { useCallback, useEffect, useState } from 'react'
import { magic } from '@lib/magic'
import { useRouter } from 'next/router'
import LoginHero from '@components/mvp/LoginHero'

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts)
  const [loading, setLoading] = useState(false)
  const [postsEnd, setPostsEnd] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const router = useRouter()
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
      } else {
        // If no user is logged in, redirect to `/login`
        // router.push('/login')
      }
    })
  }, [])

  // Get next page in pagination query
  const getMorePosts = async () => {
    setLoading(true)
    const last = posts[posts.length - 1]

    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt

    const query = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT)

    const newPosts = (await query.get()).docs.map((doc) => doc.data())

    setPosts(posts.concat(newPosts))
    setLoading(false)

    if (newPosts.length < LIMIT) {
      setPostsEnd(true)
    }
  }

  const signInWithTwitter = useCallback(async (provider) => {
    setIsLoggingIn(true)

    try {
      console.log('attempting')
      await magic.oauth.loginWithRedirect({
        provider,
        redirectURI: new URL('/callback', window.location.origin).href,
      })
      console.log('did what')
      // history.push("/");
    } catch (e) {
      console.log('failed:', e)
      setIsLoggingIn(false)
    }
  }, [])

  // const signInWithTwitter = async () => {
  //   await auth.signInWithPopup(twitterAuthProvider)
  // }

  return (
    <div
      className='flex h-screen w-screen justify-center items-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <LoginHero />
    </div>
  )

  return (
    <main>
      <Metatags title='Home Page' description='Get the latest posts on our site' />

      <div className='card card-info'>
        <h2>Arcade City</h2>
        <p>Welcome! This app lets you connect with others for rides or whatever you want, lol.</p>
        <p>
          Sign up for an 👨‍🎤 account, ✍️ write posts, then 💞 heart content created by other users.
        </p>
      </div>

      <PostFeed posts={posts} />

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}
    </main>
  )
}

// Max post to query per page
const LIMIT = 10

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT)

  const posts = (await postsQuery.get()).docs.map(postToJSON)

  return {
    props: { posts }, // will be passed to the page component as props
  }
}
