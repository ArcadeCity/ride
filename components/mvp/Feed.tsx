import PostBox from '@components/mvp/PostBox'
import { useState } from 'react'
import Onboarding from './Onboarding'
import Post from './Post'

export default function Feed() {
  const [onboarded, setOnboarded] = useState(true)
  return (
    <>
      {onboarded ? <PostBox /> : <Onboarding />}
      <div
        className='flow-root p-8 m-8 rounded-xl'
        style={{ backgroundColor: 'rgba(255,255,255,1)' }}
      >
        <ul role='list' className='-mb-8'>
          {activity.map((activityItem, activityItemIdx) => (
            <li key={activityItem.id}>
              <div className='relative pb-8'>
                {activityItemIdx !== activity.length - 1 ? (
                  <span
                    className='absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200'
                    aria-hidden='true'
                  />
                ) : null}
                <div className='relative flex items-start space-x-3'>
                  {activityItem.type === 'post' ? <Post activityItem={activityItem} /> : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

const activity = [
  {
    id: 1,
    type: 'post',
    person: { name: 'ArcadeCityMayor', href: 'https://twitter.com/ArcadeCityMayor' },
    imageUrl: 'https://pbs.twimg.com/profile_images/1402761445125902346/ZMlZ7h41_normal.jpg',
    comment: 'Hey friendos I need some stuff. A lot of things here and there and here and there',
    city: 'Austin, Texas',
    date: '6d ago',
  },
  {
    id: 4,
    type: 'post',
    person: { name: 'JasonMeyers', href: '#' },
    imageUrl:
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    comment: "I'll get ya brosef. $10",
    city: 'Austin, Texas',
    date: '2h ago',
  },
]
