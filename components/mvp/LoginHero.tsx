import { useCallback, useState } from 'react'
import { queryFirestore } from '@lib/firebase'
import { checkLocationPermissions } from '@lib/location'
import { useStores } from '@lib/root-store-context'

export default function LoginHero() {
  const [buttonText, setButtonText] = useState("See who's nearby")
  const seeNearby = useStores().seeNearby
  const lat = useStores().coords?.lat
  const lng = useStores().coords?.lng
  const store = useStores()

  const startSeeNearby = useCallback(async () => {
    if (lat && lng) {
      console.log(`Using lat/lng: ${lat}, ${lng}`)
    } else {
      const perms = await checkLocationPermissions()
      console.log('Location permission:', perms)
      switch (perms) {
        case 'granted':
        case 'prompt': {
          setButtonText('Waiting for location...')
          await seeNearby()
          break
        }
        case 'denied': {
          alert('Location permissions denied. Allow location to see posts from people near you.')
          return
        }
      }
    }
    queryFirestore({ lat, lng }, store)
  }, [lat, lng])

  return (
    <div className='fixed flex flex-col h-screen w-screen justify-center items-center'>
      <main className='mx-auto max-w-7xl px-4'>
        <div
          className='-mt-12 px-16 text-center rounded-xl h-96 flex flex-col justify-center'
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
        >
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
                onClick={startSeeNearby}
              >
                {buttonText}
              </a>
              {buttonText === 'Waiting for location...' && (
                <p className='mt-4 text-gray-500'>This may take a few seconds</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
