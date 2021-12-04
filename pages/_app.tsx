// import '@styles/globals.css'
import 'tailwindcss/tailwind.css'
import Navbar from '@components/Navbar'
import { UserContext } from '@lib/context'
import { useUserData } from '@lib/hooks'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'
import ArcadeMap from '@components/mvp/ArcadeMap'

function MyApp({ Component, pageProps }) {
  const userData = useUserData()

  return (
    <>
      <Head>
        <script src='https://unpkg.com/three/build/three.min.js' defer></script>
        <script src='https://unpkg.com/@here/harp.gl/dist/harp.js' defer></script>
      </Head>
      <UserContext.Provider value={userData}>
        {/* <Navbar /> */}
        <Component {...pageProps} />
        <Toaster />
      </UserContext.Provider>
      <ArcadeMap />
    </>
  )
}

export default MyApp
