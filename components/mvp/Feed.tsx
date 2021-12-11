import PostBox from '@components/mvp/PostBox'
import { getSnapshot } from 'mobx-state-tree'
import { useStores } from '@lib/root-store-context'
import { useStore } from '@lib/store'
import { values } from 'mobx'
import { useState } from 'react'
import Onboarding from './Onboarding'
import Post from './Post'
import { observer } from 'mobx-react-lite'

function Feed() {
  const [onboarded, setOnboarded] = useState(true)
  const posts = useStores().postsArray

  // return posts.map((post, wat) => (
  //   <p key={post.id} className='text-white'>
  //     {/* {post.toString()} */}
  //     {post.content}
  //   </p>
  // ))
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

export default observer(Feed)
