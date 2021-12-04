import { ChatAltIcon } from '@heroicons/react/solid'

export default function Post({ activityItem }) {
  return (
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
  )
}
