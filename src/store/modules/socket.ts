import { defineStore } from 'pinia'
import { store } from '@/store'
import main from '@/main'
import { showToast, Toast } from 'vant'
import { useAppStoreWithOut } from '@/store/modules/app'

interface SocketStore {
  // 连接状态
  isConnected: boolean
  // 消息内容
  message: any
  // 重新连接错误
  reconnectError: boolean
  // 心跳消息发送时间
  heartBeatInterval: number
  // 心跳定时器
  heartBeatTimer: number
  notifyMsg: string
  notifyShow: boolean
}

export const useSocketStore = defineStore({
  id: 'socket',
  state: (): SocketStore => ({
    // 连接状态socket
    isConnected: false,
    // 消息内容
    message: '',
    // 重新连接错误
    reconnectError: false,
    // 心跳消息发送时间
    heartBeatInterval: 50000,
    // 心跳定时器
    heartBeatTimer: 0,
    notifyMsg: '',
    notifyShow: false
  }),
  actions: {
    SOCKET_NOTIFY(message: string) {
      showToast({
        message: message,
        position: 'middle'
      })
    },
    sendObj(obj: object) {
      if (this.isConnected) {
        main.config.globalProperties.$socket.sendObj(obj)
      } else {
        this.SOCKET_NOTIFY('链接已断开')
      }
    },
    // 连接打开
    SOCKET_ONOPEN(event: any) {
      main.config.globalProperties.$socket = event.currentTarget
      this.isConnected = true
      this.SOCKET_NOTIFY('服务器已连接')
      const appStore = useAppStoreWithOut()
      const accessToken = appStore.getAccessToken
      if (accessToken) {
        this.sendObj({
          invoke: 'user/register',
          data: {
            accessToken: accessToken
          }
        })
        if (typeof window.Android == 'object') {
          window.Android.startNativeWebsocket(
            import.meta.env.VITE_API_BASEPATH + 'app/websocket',
            accessToken
          )
        }
      }
      // 连接成功时启动定时发送心跳消息，避免被服务器断开连接
      this.heartBeatTimer = window.setInterval(() => {
        this.isConnected &&
          this.sendObj({
            invoke: 'system/ping'
          })
      }, this.heartBeatInterval)
    },
    // 连接关闭
    SOCKET_ONCLOSE(event: any) {
      this.isConnected = false
      // 连接关闭时停掉心跳消息
      window.clearInterval(this.heartBeatTimer)
      this.heartBeatTimer = 0
      this.SOCKET_NOTIFY('链接已断开')
      console.log('连接已断开: ' + new Date())
      console.log(event)
    },
    // 发生错误
    SOCKET_ONERROR(event: any) {
      console.error(event)
    },
    // 收到服务端发送的消息
    SOCKET_ONMESSAGE(message: any) {
      this.message = message
      // console.log('收到消息：', message)
      // switch (message.action) {
      //   case 'USER_CHANNEL':
      //     notify('特别提醒', message.data)
      //     break
      //   case 'FARMLAND_CHANNEL':
      //     notify('种植区活动', message.data)
      //     break
      //   case 'LIVESTOCK_CHANNEL':
      //     notify('养殖区活动', message.data)
      //     break
      // }
    },
    // 自动重连
    SOCKET_RECONNECT(count: number) {
      console.info('消息系统重连中...', count)
    },
    // 重连错误
    SOCKET_RECONNECT_ERROR() {
      this.reconnectError = true
    }
  }
})

// Need to be used outside the setup
export function useSocketStoreWithOut() {
  return useSocketStore(store)
}
