import { Instance, onSnapshot, types } from 'mobx-state-tree'
import storage from 'localforage'
import { mst } from 'reactotron-mst'
import * as actions from './mst-actions'

const Tron =
  typeof window !== 'undefined' ? require('reactotron-react-js').default : { configure: () => {} }
// import Tron from 'reactotron-react-js'

export const ROOT_STATE_STORAGE_KEY = 'root7'

export const TwitterMetadataModel = types.model({
  email: '',
  emailVerified: false,
  locale: '',
  name: '',
  preferredUsername: '',
  profile: '',
  sub: '',
})

export const GeolocationModel = types.model({
  latitude: 0.0,
  countryCode: '',
  longitude: 0.0,
  city: '',
})

export const PostModel = types.model({
  id: types.identifier,
  content: types.optional(types.string, ''),
  geolocation: GeolocationModel,
  twitterMetadata: types.maybeNull(TwitterMetadataModel),
  createdAt: types.number,
})

export const RootStoreModel = types
  .model({
    city: types.maybeNull(types.string),
    coords: types.frozen(),
    countryCode: types.maybeNull(types.string),
    posts: types.map(PostModel),
    user: types.maybeNull(TwitterMetadataModel),
    showFeed: false,
  })
  .actions((self) => ({
    seeNearby: async (): Promise<void> => await actions.seeNearby(self as RootStore),
    addPost(post: Post) {
      self.posts.set(post.id, PostModel.create(post))
    },
    setCity(city: string) {
      self.city = city
    },
    setCoords(coords: any) {
      self.coords = coords
    },
    setCountryCode(code: string) {
      self.countryCode = code
    },
    setShowFeed(show: boolean) {
      self.showFeed = show
    },
    setUser(user: TwitterMetadata) {
      self.user = user
    },
    reset() {
      self.user = null
      // self.city = null
      // self.coords = null
      // self.countryCode = null
      self.posts = undefined
    },
  }))
  .views((self) => ({
    get postsArray(): Post[] {
      const posts = Array.from(self.posts.values())
      return posts
        .filter((p) => !!p.twitterMetadata)
        .sort((p1, p2) => (p1.createdAt > p2.createdAt ? -1 : 1))
    },
  }))

export interface Post extends Instance<typeof PostModel> {}
export interface TwitterMetadata extends Instance<typeof TwitterMetadataModel> {}
export interface RootStore extends Instance<typeof RootStoreModel> {}

export async function setupRootStore() {
  let rootStore: RootStore
  let data: any
  // prepare the environment that will be associated with the RootStore.
  // const env = await createEnvironment()
  rootStore = RootStoreModel.create({}) // , env
  try {
    // load data from storage
    data = (await storage.getItem(ROOT_STATE_STORAGE_KEY)) || {}
    rootStore = RootStoreModel.create(JSON.parse(data)) // , env
  } catch (e) {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
    rootStore = RootStoreModel.create({}) // , env

    // but please inform us what happened
    console.log(e)
    // __DEV__ && console.tron.error(e.message, null)
  }

  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    Tron.configure({
      name: 'Ride',
      port: 9090,
    })

    // ignore some chatty `mobx-state-tree` actions
    const RX = /postProcessSnapshot|@APPLY_SNAPSHOT/

    // hookup mobx-state-tree middleware
    Tron.use(
      mst({
        filter: (event) => RX.test(event.name) === false,
      })
    )
    Tron.connect()
    Tron.trackMstNode(rootStore)
  }
  // reactotron logging
  // if (__DEV__) {
  // env.reactotron.setRootStore(rootStore, data)
  // }

  let lastSaved = new Date()
  let secondsSinceLastSent: number | null = null
  let SAVE_INTERVAL = 5

  // track changes & save to storage
  onSnapshot(rootStore, (snapshot) => {
    storage.setItem(ROOT_STATE_STORAGE_KEY, JSON.stringify(snapshot))
    // const now = new Date()
    // const dif = now.getTime() - lastSaved.getTime()
    // secondsSinceLastSent = dif / 1000

    // if (!lastSaved || secondsSinceLastSent > SAVE_INTERVAL) {
    //   lastSaved = new Date()
    //   storage.setItem(ROOT_STATE_STORAGE_KEY, JSON.stringify(snapshot))
    //   console.log('Saved', lastSaved)
    // }
  })

  return rootStore
}
