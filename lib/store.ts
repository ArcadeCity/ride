import create from 'zustand'

export const useStore = create<any>((set) => ({
  oauthdata: null,
  setoauthdata: (oauthdata) => set((state) => ({ oauthdata })),
  // increase: (by) => set(state => ({ bears: state.bears + by })),
}))
