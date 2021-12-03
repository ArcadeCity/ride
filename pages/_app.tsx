// import '@styles/globals.css'
import 'tailwindcss/tailwind.css'
import Navbar from '@components/Navbar'
import { UserContext } from '@lib/context'
import { useUserData } from '@lib/hooks'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'

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
      <canvas
        id='map'
        style={{
          position: 'fixed',
          height: '100vh',
          width: '100vw',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      ></canvas>
    </>
  )
}

export default MyApp
