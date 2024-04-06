import { defineStore } from 'pinia'
import type { AppState } from '@/config/app'
import { store } from '@/store'

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => {
    return {
      title: '',
      pageLoading: false,
      passport: '',
      roles: [],
      accessToken: '',
      refreshToken: '',
      websocketConnected: false,
      isDark: false
    }
  },
  persist: {
    debug: true
  },
  getters: {
    getTitle(): string {
      return this.title
    },
    getPageLoading(): boolean {
      return this.pageLoading
    },
    getPassport(): string {
      return this.passport
    },
    getRoles(): string[] {
      return this.roles
    },
    isManager(): boolean {
      return this.roles.includes('MANAGER')
    },
    getAccessToken(): string {
      return this.accessToken
    },
    getRefreshToken(): string {
      return this.refreshToken
    },
    getWebsocketConnected(): boolean {
      return this.websocketConnected
    },
    getIsDark(): boolean {
      return this.isDark
    }
  },
  actions: {
    resetApp() {
      this.accessToken = ''
      this.refreshToken = ''
      this.roles = []
    },
    setTitle(title: string) {
      return this.title
    },
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading
    },
    setPassport(passport: string) {
      this.passport = passport
    },

    setRoles(roles: string[]) {
      this.roles = roles
    },
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken
    },
    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken
    },
    setWebsocketConnected(websocketConnected: boolean) {
      this.websocketConnected = websocketConnected
    },
    setIsDark(isDark: boolean) {
      this.isDark = isDark
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
    }
  }
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
