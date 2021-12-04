import PostForm from '@components/PostForm'
import { ChatAltIcon } from '@heroicons/react/solid'

export default function Feed() {
  return (
    <>
      <PostForm />
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
                  {activityItem.type === 'post' ? (
                    <>
                      <div className='relative'>
                        <img
                          className='h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white'
                          src={activityItem.imageUrl}
                          alt=''
                        />

                        <span className='absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px'>
                          <ChatAltIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                        </span>
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div>
                          <div className='text-sm'>
                            <a
                              target='_blank'
                              href={activityItem.person.href}
                              className='font-medium text-gray-900'
                            >
                              {activityItem.person.name}
                            </a>
                          </div>
                          <p className='mt-0.5 text-sm text-gray-500'>
                            Posted {activityItem.date} in {activityItem.city}
                          </p>
                        </div>
                        <div className='mt-2 text-sm text-gray-700'>
                          <p>{activityItem.comment}</p>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {activityItem.type === 'comment' ? (
                    <>
                      <div className='relative'>
                        <img
                          className='h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white'
                          src={activityItem.imageUrl}
                          alt=''
                        />

                        <span className='absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px'>
                          <ChatAltIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                        </span>
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div>
                          <div className='text-sm'>
                            <a
                              target='_blank'
                              href={activityItem.person.href}
                              className='font-medium text-gray-900'
                            >
                              {activityItem.person.name}
                            </a>
                          </div>
                          <p className='mt-0.5 text-sm text-gray-500'>
                            Commented {activityItem.date} in {activityItem.city}
                          </p>
                        </div>
                        <div className='mt-2 text-sm text-gray-700'>
                          <p>{activityItem.comment}</p>
                        </div>
                      </div>
                    </>
                  ) : null}
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
    type: 'comment',
    person: { name: 'JasonMeyers', href: '#' },
    imageUrl:
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    comment: "I'll get ya brosef. $10",
    city: 'Austin, Texas',
    date: '2h ago',
  },
]
