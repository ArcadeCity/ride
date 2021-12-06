import create from 'zustand'

export const useStore = create<any>((set, get) => ({
  posts: [],
  oauthdata: null,
  setoauthdata: (oauthdata) => set((state) => ({ oauthdata })),
  geolocation: {
    latitude: 40.7589, //30.2666,
    longitude: -73.9851, //-97.7333,
    city: 'Austin, Texas',
    countryCode: 'US',
  },
  add: (post) => set((state) => ({ posts: [...state.posts, { ...post }] })),
  actions: {
    addPost(post) {
      const sofar = get().posts
      sofar.push(post)
      set({ posts: sofar })
      console.log('added post:', post)
      // get().posts.push(post)
    },
    setPosts(posts) {
      set({ posts })
    },
  },
}))
