import Image from 'next/image'

export default function Post({ post }) {
  if (!post.twitterMetadata) return <></>
  return (
    <>
      <div className='relative'>
        {post.twitterMetadata.profile && (
          <a
            target='_blank'
            rel='noreferrer'
            href={`https://twitter.com/${post.twitterMetadata.preferredUsername}`}
          >
            <div className='h-10 w-10 flex items-center justify-center ring-8 ring-white'>
              <Image
                className='rounded-full bg-gray-400'
                src={post.twitterMetadata.profile}
                layout='fill'
                alt=''
              />
            </div>
          </a>
        )}
      </div>
      <div className='min-w-0 flex-1'>
        <div>
          <div className='text-sm'>
            <a
              target='_blank'
              rel='noreferrer'
              href={`https://twitter.com/${post.twitterMetadata.preferredUsername}`}
              className='font-medium text-gray-900'
            >
              {`${post.twitterMetadata.name} @${post.twitterMetadata.preferredUsername}`}
            </a>
          </div>
          <p className='mt-0.5 text-sm text-gray-500'>
            Posted at {new Date(post.createdAt).toLocaleString()}{' '}
            {post.geolocation?.city ? `from ${post.geolocation.city}` : ''}
          </p>
        </div>
        <div className='mt-2 text-sm text-gray-700'>
          <p>{post.content}</p>
        </div>
      </div>
    </>
  )
}
