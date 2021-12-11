// import '@styles/globals.css'
import 'tailwindcss/tailwind.css'
import Navbar from '@components/mvp/Navbar'
import { UserContext } from '@lib/context'
import { useUserData } from '@lib/hooks'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'
import ArcadeMap from '@components/mvp/ArcadeMap'
import { useStore } from '@lib/store'
import { useEffect, useState } from 'react'
import { RootStore, setupRootStore } from '@lib/mst'
import { RootStoreProvider } from '@lib/root-store-context'

function MyApp({ Component, pageProps }) {
  const userData = useUserData()
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      const root = await setupRootStore()
      setRootStore(root)
      console.log('Set root store.')
    })()
  }, [])

  return (
    <>
      <Head>
        <script src='https://unpkg.com/three/build/three.min.js' defer></script>
        <script src='https://unpkg.com/@here/harp.gl/dist/harp.js' defer></script>
      </Head>
      {!!rootStore && (
        <RootStoreProvider value={rootStore}>
          <UserContext.Provider value={userData}>
            <Navbar />
            <Component {...pageProps} />
            <Toaster />
          </UserContext.Provider>
        </RootStoreProvider>
      )}
      <ArcadeMap />
    </>
  )
}

export default MyApp
