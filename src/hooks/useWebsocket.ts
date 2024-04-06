import { App } from 'vue'
// @ts-ignore
import VueNativeSock from 'vue3-native-websocket'

export const setupStore = (app: App<Element>) => {
  app.use(VueNativeSock, '')
}

export { VueNativeSock }
