/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useContext } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MenuIcon, XIcon, LogoutIcon } from '@heroicons/react/outline'
import { PlusSmIcon } from '@heroicons/react/solid'
import { UserContext } from '@lib/context'
import { useStore } from '@lib/store'
import { magic } from '@lib/magic'
import { auth } from '@lib/firebase'
import Image from 'next/image'
import { useStores } from '@lib/root-store-context'
import storage from 'localforage'
import { ROOT_STATE_STORAGE_KEY } from '@lib/mst'

const navigation = [
  // { name: 'Dashboard', href: '#', current: true },
  // { name: 'Team', href: '#', current: false },
  // { name: 'Projects', href: '#', current: false },
  // { name: 'Calendar', href: '#', current: false },
]
const userNavigation = [
  // { name: 'Your Profile', href: '#' },
  // { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const { user, username } = useContext(UserContext)
  const twitterMetadata = useStore((s) => s.oauthdata)
  const setoauthdata = useStore((s) => s.setoauthdata)
  const setUser = useStores().setUser
  const setShowFeed = useStores().setShowFeed
  const reset = useStores().reset
  const authed = !!useStores().user
  const handleLogout = async () => {
    setoauthdata(null)
    setUser(null)
    reset()
    storage.removeItem(ROOT_STATE_STORAGE_KEY)
    setShowFeed(false)
    await magic.user.logout()
    await auth.signOut()
  }
  return (
    <Disclosure as='nav' className='bg-transparent' style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      {({ open }) => (
        <>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between h-16'>
              <div className='flex'>
                <div className='-ml-2 mr-2 flex items-center md:hidden'>
                  {/* Mobile menu button */}
                  <Disclosure.Button className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                    <span className='sr-only'>Open main menu</span>
                    {open ? (
                      <XIcon className='block h-6 w-6' aria-hidden='true' />
                    ) : (
                      <MenuIcon className='block h-6 w-6' aria-hidden='true' />
                    )}
                  </Disclosure.Button>
                </div>
                <div className='flex-shrink-0 flex items-center py-3'>
                  <div className='block lg:hidden h-8 w-8 relative'>
                    <Image
                      src='/aclogo512.png'
                      alt='Arcade City'
                      layout='fill'
                      objectFit='contain'
                    />
                  </div>
                  <div className='hidden lg:block h-12 w-12 relative'>
                    <Image
                      src='/aclogo512.png'
                      alt='Arcade City'
                      layout='fill'
                      objectFit='contain'
                    />
                  </div>
                </div>
                <div className='hidden md:ml-6 md:flex md:items-center md:space-x-4'>
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'px-3 py-2 rounded-md text-sm font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className='flex items-center'>
                {/* <div className='flex-shrink-0'>
                  <button
                    type='button'
                    className='relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500'
                  >
                    <PlusSmIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                    <span>New Post</span>
                  </button>
                </div> */}
                <div className='hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center'>
                  {authed && (
                    <button
                      type='button'
                      className='bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
                      onClick={handleLogout}
                    >
                      <span className='sr-only'>TEMP LOGOUT</span>
                      <LogoutIcon className='h-6 w-6' aria-hidden='true' />
                    </button>
                  )}

                  {/* Profile dropdown */}
                  {twitterMetadata ? (
                    <Menu as='div' className='ml-3 relative'>
                      <div>
                        <Menu.Button className='bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'>
                          <span className='sr-only'>Open user menu</span>
                          {twitterMetadata?.profile && (
                            <Image
                              className='h-8 w-8 rounded-full'
                              src={twitterMetadata.profile}
                              layout='fill'
                              alt=''
                            />
                          )}
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter='transition ease-out duration-200'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'
                      >
                        <Menu.Items className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                  onClick={handleLogout}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as='a'
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className='pt-4 pb-3 border-t border-gray-700'>
              <div className='flex items-center px-5 sm:px-6'>
                <div className='flex-shrink-0'>
                  <Image
                    className='h-10 w-10 rounded-full'
                    src={twitterMetadata?.profile ?? ''}
                    alt=''
                  />
                </div>
                <div className='ml-3'>
                  <div className='text-base font-medium text-white'>{user?.name}</div>
                  <div className='text-sm font-medium text-gray-400'>{user?.email}</div>
                </div>
                <button
                  type='button'
                  className='ml-auto flex-shrink-0 bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
                >
                  <span className='sr-only'>View notifications</span>
                  <LogoutIcon className='h-6 w-6' aria-hidden='true' />
                </button>
              </div>
              <div className='mt-3 px-2 space-y-1 sm:px-3'>
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as='a'
                    href={item.href}
                    className='block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700'
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
