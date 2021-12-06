import PostBox from '@components/mvp/PostBox'
import { useStore } from '@lib/store'
import { useState } from 'react'
import Onboarding from './Onboarding'
import Post from './Post'

export default function Feed() {
  const [onboarded, setOnboarded] = useState(true)
  // console.log('posts:', posts)
  const posts = useStore((s) => s.posts)
  console.log('Posts:', posts.length, posts)
  return (
    <>
      {onboarded ? <PostBox /> : <Onboarding />}
      <div
        className='flow-root p-8 m-8 rounded-xl'
        style={{ backgroundColor: 'rgba(255,255,255,1)' }}
      >
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
    </>
  )
}
