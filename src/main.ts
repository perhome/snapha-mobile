declare global {
  interface Window {
    Android: any
  }
}

import { createApp } from 'vue'
import App from '@/App.vue'
import { store } from '@/store'
import router from '@/router'

// import './index.css'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'

import './permission'

import { Lazyload } from 'vant'

const app = createApp(App)
  .use(store)
  .use(router)
  .use(Lazyload, {
    lazyComponent: true
  })

// .use(VueNativeSock, import.meta.env.VITE_API_BASEPATH+'app/websocket', {
//   store: useSocketStoreWithOut(),
//   format: "json",
//   connectManually: false,
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 3000
// })

app.mount('#app')

export default app
