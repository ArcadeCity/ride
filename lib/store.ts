import create from 'zustand'

export const useStore = create<any>((set) => ({
  oauthdata: null,
  setoauthdata: (oauthdata) => set((state) => ({ oauthdata })),
  geolocation: {
    latitude: 30.2666,
    longitude: -97.7333,
  },
}))
