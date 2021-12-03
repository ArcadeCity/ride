import PostFeed from '@components/PostFeed'
import Metatags from '@components/Metatags'
import Loader from '@components/Loader'
import { firestore, fromMillis, postToJSON } from '@lib/firebase'

import { useEffect, useState } from 'react'

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

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts)
  const [loading, setLoading] = useState(false)

  const [postsEnd, setPostsEnd] = useState(false)

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

  let harp
  if (typeof window !== 'undefined') {
    // @ts-ignore
    harp = window.harp as any
  } else {
    harp = null
  }

  useEffect(() => {
    const canvas = document.getElementById('map')
    if (!harp) return
    const mapView = new harp.MapView({
      canvas,
      theme: 'resources/arcade.json',
    })

    // center the camera to RJ
    mapView.lookAt({
      target: new harp.GeoCoordinates(-22.931363110413354, -43.183705305311655),
      zoomLevel: 18,
      tilt: 40,
    })

    // const mapControls = new harp.MapControls(mapView)
    // const ui = new harp.MapControlsUI(mapControls)
    // canvas.parentElement.appendChild(ui.domElement)

    mapView.resize(window.innerWidth, window.innerHeight)
    // mapView.renderLabels = false
    window.onresize = () => mapView.resize(window.innerWidth, window.innerHeight)

    const vectorTileDataSource = new harp.VectorTileDataSource({
      authenticationCode: '_ZQeCfAB3nJFJ4E7JJ7W-CwSSW3vvUh6032RY85_OVs',
    })
    mapView.addDataSource(vectorTileDataSource)
  }, [harp])

  return (
    <div
      className='flex h-screen w-screen justify-center items-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <main className='mx-auto max-w-7xl px-4'>
        <div className='text-center'>
          <h1 className='text-4xl tracking-tight font-extrabold text-gray-100 sm:text-5xl md:text-6xl'>
            <span className='block xl:inline'>Connect Freely.</span>
          </h1>
          <p className='mt-3 max-w-md mx-auto text-base text-indigo-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl'>
            Peer-to-Peer Rides and More
          </p>
          <div className='mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8'>
            <div className='rounded-md shadow'>
              <a
                href='#'
                className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10'
              >
                Log in with Twitter
              </a>
            </div>
            {/* <div className='rounded-md shadow'>
              <a
                href='#'
                className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10'
              >
                Get started
              </a>
            </div>
            <div className='mt-3 rounded-md shadow sm:mt-0 sm:ml-3'>
              <a
                href='#'
                className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10'
              >
                Live demo
              </a>
            </div> */}
          </div>
        </div>
      </main>
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
