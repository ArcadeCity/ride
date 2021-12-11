import { Instance, onSnapshot, types } from 'mobx-state-tree'
import storage from 'localforage'

const ROOT_STATE_STORAGE_KEY = 'root'

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
  twitterMetadata: TwitterMetadataModel,
  updatedAt: types.Date,
})

export const RootStoreModel = types
  .model({
    posts: types.map(PostModel),
  })
  .actions((self) => ({
    addPost(post: Post) {
      self.posts.set(post.id, PostModel.create(post))
    },
  }))

export interface Post extends Instance<typeof PostModel> {}
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

  // reactotron logging
  // if (__DEV__) {
  //   env.reactotron.setRootStore(rootStore, data)
  // }

  let lastSaved = new Date()
  let secondsSinceLastSent: number | null = null
  let SAVE_INTERVAL = 5

  // track changes & save to storage
  onSnapshot(rootStore, (snapshot) => {
    const now = new Date()
    const dif = now.getTime() - lastSaved.getTime()
    secondsSinceLastSent = dif / 1000

    if (!lastSaved || secondsSinceLastSent > SAVE_INTERVAL) {
      lastSaved = new Date()
      storage.setItem(ROOT_STATE_STORAGE_KEY, JSON.stringify(snapshot))
      console.log('Saved', lastSaved)
    }
  })

  return rootStore
}
