import { Instance, types } from 'mobx-state-tree'

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

export const RootStore = types
  .model({
    posts: types.map(PostModel),
  })
  .actions((self) => ({
    addPost(post: Post) {
      self.posts.set(post.id, PostModel.create(post))
    },
  }))

export interface Post extends Instance<typeof PostModel> {}
