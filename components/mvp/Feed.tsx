import PostBox from '@components/mvp/PostBox'
import { useStores } from '@lib/root-store-context'
import { useState } from 'react'
import Onboarding from './Onboarding'
import Post from './Post'
import { observer } from 'mobx-react-lite'

function Feed() {
  const [onboarded, setOnboarded] = useState(true)
  const posts = useStores().postsArray
  const city = useStores().city

  return (
    <>
      <div className='flex justify-center flex-col items-center'>
        {onboarded ? <PostBox /> : <Onboarding />}

        <div
          className='flow-root p-8 m-8 rounded-xl w-full max-w-xl'
          style={{ backgroundColor: 'rgba(255,255,255,1)' }}
        >
          {posts.length === 0 && (
            <>
              <p className='mb-4'>
                There are no posts near <strong>{city}</strong>. You can make the first post!
              </p>
              <p className='mb-8'>
                Introduce yourself and say if you are re looking to give or take rides, or any other
                service.
              </p>
            </>
          )}
          <ul role='list' className='-mb-8'>
            {posts.map((post, postIdx) => (
              <li key={post.id}>
                <div className='relative pb-8'>
                  {postIdx !== posts.length - 1 ? (
                    <span
                      className='absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200'
                      aria-hidden='true'
                    />
                  ) : null}
                  <div className='relative flex items-start space-x-3'>
                    <Post post={post} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default observer(Feed)
