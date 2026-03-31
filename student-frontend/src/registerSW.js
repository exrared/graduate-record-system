import { registerSW } from 'virtual:pwa-register'

export const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New version available')
  },
  onOfflineReady() {
    console.log('App ready offline')
  },
})