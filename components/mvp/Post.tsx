import { ChatAltIcon } from '@heroicons/react/solid'
import Image from 'next/image'

export default function Post({ post }) {
  console.log(post)
  return (
    <>
      <div className='relative'>
        {post.twitterMetadata.profile && (
          <div className='h-10 w-10 flex items-center justify-center ring-8 ring-white'>
            <Image
              className='rounded-full bg-gray-400'
              src={post.twitterMetadata.profile}
              layout='fill'
              alt=''
            />
          </div>
        )}

        <span className='absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px'>
          <ChatAltIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
        </span>
      </div>
      <div className='min-w-0 flex-1'>
        <div>
          <div className='text-sm'>
            <a target='_blank' rel='noreferrer' href='#' className='font-medium text-gray-900'>
              {`${post.twitterMetadata.name} @${post.twitterMetadata.preferredUsername}`}
            </a>
          </div>
          <p className='mt-0.5 text-sm text-gray-500'>
            Posted at some point
            {/* Posted {activityItem.date} in {activityItem.city} */}
          </p>
        </div>
        <div className='mt-2 text-sm text-gray-700'>
          <p>{post.content}</p>
        </div>
      </div>
    </>
  )
}
