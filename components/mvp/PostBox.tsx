import { auth, GeoFirestore, GeoPoint, serverTimestamp } from '@lib/firebase'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { useStores } from '@lib/root-store-context'
import { signInWithTwitter } from '@lib/twitter'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useContext } from 'react'
import { UserContext } from '@lib/context'

export default function PostBox() {
  const twitterMetadata = useStores().user
  const { user, username } = useContext(UserContext)
  const city = useStores().city
  // console.log('user:', user)
  // console.log('authState:', authState)

  const lat = useStores().coords?.lat
  const lng = useStores().coords?.lng

  const geolocation = {
    lat,
    lng,
    city: useStores().city,
    countryCode: useStores().countryCode,
  }

  // useStore((s) => s.oauthdata)
  // const geolocation = useStore((s) => s.geolocation)
  const { register, errors, handleSubmit, formState, reset, watch } = useForm({
    // defaultValues,
    mode: 'onChange',
  })

  const { isValid, isDirty } = formState

  if (!twitterMetadata) {
    return (
      <div className='flex items-center justify-center space-x-4 m-8 w-full max-w-xl bg-white rounded-xl'>
        <div className='p-8 text-center'>
          <p className='mb-6'>
            Log in with Twitter to post for users near <strong>{city}</strong>.
          </p>
          <a
            href='#'
            className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10'
            onClick={signInWithTwitter}
          >
            Log in with Twitter
          </a>
        </div>
      </div>
    )
  }

  // console.log(auth.currentUser)
  if (!auth.currentUser)
    return (
      <div className='flex items-center justify-center space-x-4 m-8 w-full max-w-xl bg-white rounded-xl'>
        <div className='p-8 text-center'>
          <p className='mb-6'>Authenticating...</p>
        </div>
      </div>
    )
  // if (!auth.currentUser) return <></>

  const postsCollection = GeoFirestore.collection('users')
    .doc(auth.currentUser.uid)
    .collection('posts')

  const submitPost = async ({ content }) => {
    const docRef = await postsCollection.add({
      content,
      geolocation,
      twitterMetadata,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      coordinates: new GeoPoint(lat, lng),
    })

    // console.log('auth.currentUser.uid:', auth.currentUser.uid)
    // console.log('postId:', docRef.id)

    reset({ content: '' })

    toast.success('Post submitted successfully!')
  }

  return (
    <div className='flex items-start space-x-4 m-8 w-full max-w-xl'>
      <div className='flex-shrink-0'>
        {!!twitterMetadata?.profile && (
          <div className='inline-block h-10 w-10 relative'>
            <Image className='rounded-full' src={twitterMetadata.profile} alt='' layout='fill' />
          </div>
        )}
      </div>
      <div className='min-w-0 flex-1'>
        <form onSubmit={handleSubmit(submitPost)} className='relative'>
          <div className='border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500'>
            <label htmlFor='comment' className='sr-only'>
              Write a post
            </label>
            <textarea
              name='content'
              ref={register({
                maxLength: { value: 20000, message: 'Post content is too long' },
                minLength: { value: 10, message: 'Post content is too short' },
                required: { value: true, message: 'Post content is required' },
              })}
              rows={3}
              id='content'
              className='block w-full py-3 border-0 resize-none focus:ring-0 sm:text-sm'
              placeholder='Write a post...'
              defaultValue={''}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div className='py-2' aria-hidden='true'>
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className='py-px'>
                <div className='h-9' />
              </div>
            </div>
          </div>

          <div className='absolute bottom-0 inset-x-0 pl-3 pr-2 py-2 flex justify-between'>
            <div className='flex items-center space-x-5'>
              {errors.content && <p className='text-gray-500'>{errors.content.message}</p>}
              {/* <div className='flex items-center'>
                <button
                  type='button'
                  className='-m-2.5 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-500'
                >
                  <PaperClipIcon className='h-5 w-5' aria-hidden='true' />
                  <span className='sr-only'>Attach a file</span>
                </button>
              </div> */}
            </div>
            <div className='flex-shrink-0'>
              <button
                type='submit'
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                disabled={!isDirty || !isValid}
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
